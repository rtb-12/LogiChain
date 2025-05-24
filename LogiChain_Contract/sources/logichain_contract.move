module logichain::RunnerRegistry {
    use sui::balance::{Self, Balance};
    use sui::clock::{Self, Clock};
    use sui::coin::{Self, Coin};
    use sui::event;
    use sui::sui::SUI;

    // Error codes
    const ENotOperator: u64 = 101;
    const EInsufficientStake: u64 = 102;
    const EStakeTooLow: u64 = 103;

    const MIN_STAKE_AMOUNT: u64 = 1000000000;
    const HEARTBEAT_EXPIRY_MS: u64 = 3600000;

    public struct RunnerRegistered has copy, drop {
        operator: address,
        stake: u64,
        tags: vector<u8>,
    }

    public struct RunnerSlashed has copy, drop {
        operator: address,
        amount: u64,
        reason: vector<u8>,
    }

    public struct HeartbeatReceived has copy, drop {
        runner_id: address,
        timestamp: u64,
    }

    public struct RunnerStatus has copy, drop, store {
        active: bool,
        suspended: bool,
    }

    public struct RunnerInfo has key, store {
        id: UID,
        operator: address,
        stake: u64,
        last_beat: u64,
        performance_score: u64,
        status: RunnerStatus,
        specs: vector<u8>,
        tags: vector<u8>,
    }

    public struct RunnerTreasury has key {
        id: UID,
        balance: Balance<SUI>,
    }

    fun init(ctx: &mut TxContext) {
        transfer::share_object(RunnerTreasury {
            id: object::new(ctx),
            balance: balance::zero<SUI>(),
        });
    }

    /// Register a new runner by staking SUI
    public entry fun register_runner(
        treasury: &mut RunnerTreasury,
        stake_coin: Coin<SUI>,
        specs: vector<u8>,
        tags: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext,
    ) {
        let stake_amt = coin::value(&stake_coin);
        assert!(stake_amt >= MIN_STAKE_AMOUNT, EStakeTooLow);

        let stake_balance = coin::into_balance(stake_coin);
        balance::join(&mut treasury.balance, stake_balance);

        let id = object::new(ctx);
        let now = clock::timestamp_ms(clock);
        let operator = tx_context::sender(ctx);

        let info = RunnerInfo {
            id,
            operator,
            stake: stake_amt,
            last_beat: now,
            performance_score: 100,
            status: RunnerStatus { active: true, suspended: false },
            specs,
            tags,
        };

        event::emit(RunnerRegistered {
            operator,
            stake: stake_amt,
            tags,
        });

        transfer::share_object(info);
    }

    public entry fun heartbeat(runner_info: &mut RunnerInfo, clock: &Clock, ctx: &mut TxContext) {
        assert!(runner_info.operator == tx_context::sender(ctx), ENotOperator);
        let now = clock::timestamp_ms(clock);
        runner_info.last_beat = now;

        event::emit(HeartbeatReceived {
            runner_id: object::uid_to_address(&runner_info.id),
            timestamp: now,
        });
    }

    public fun is_runner_active(runner_info: &RunnerInfo, clock: &Clock): bool {
        let now = clock::timestamp_ms(clock);
        let time_since_beat = now - runner_info.last_beat;

        runner_info.status.active && 
    !runner_info.status.suspended && 
    time_since_beat <= HEARTBEAT_EXPIRY_MS
    }

    public entry fun slash(
        runner_info: &mut RunnerInfo,
        amount: u64,
        reason: vector<u8>,
        _ctx: &mut TxContext,
    ) {
        // In production, this would require governance approval
        assert!(runner_info.stake >= amount, EInsufficientStake);
        runner_info.stake = runner_info.stake - amount;

        if (runner_info.performance_score > amount / 10) {
            runner_info.performance_score = runner_info.performance_score - (amount / 10);
        } else {
            runner_info.performance_score = 0;
        };

        if (runner_info.stake < MIN_STAKE_AMOUNT) {
            runner_info.status.suspended = true;
        };

        event::emit(RunnerSlashed {
            operator: runner_info.operator,
            amount,
            reason,
        });
    }

    public entry fun withdraw_stake(
        runner_info: &mut RunnerInfo,
        treasury: &mut RunnerTreasury,
        amount: u64,
        ctx: &mut TxContext,
    ) {
        assert!(runner_info.operator == tx_context::sender(ctx), ENotOperator);
        assert!(runner_info.stake >= amount, EInsufficientStake);

        let remaining = runner_info.stake - amount;
        assert!(remaining >= MIN_STAKE_AMOUNT || remaining == 0, EStakeTooLow);

        runner_info.stake = remaining;

        if (remaining == 0) {
            runner_info.status.active = false;
            runner_info.status.suspended = false;
        };

        let withdraw_balance = balance::split(&mut treasury.balance, amount);
        let withdraw_coin = coin::from_balance(withdraw_balance, ctx);
        transfer::public_transfer(withdraw_coin, tx_context::sender(ctx));
    }
}

module logichain::JobQueue {
    use logichain::RunnerRegistry;
    use sui::clock::{Self, Clock};
    use sui::event;

    const EJobAlreadyAssigned: u64 = 201;
    const EJobNotAssigned: u64 = 202;
    const EIncorrectAssignee: u64 = 203;
    const ERunnerNotActive: u64 = 204;

    const JOB_STATUS_QUEUED: u8 = 0;
    const JOB_STATUS_IN_PROGRESS: u8 = 1;
    const JOB_STATUS_COMPLETED: u8 = 2;
    const JOB_STATUS_FAILED: u8 = 3;

    public struct JobCreated has copy, drop {
        job_id: address,
        repo: vector<u8>,
        commit: vector<u8>,
        created_at: u64,
    }

    public struct JobAssigned has copy, drop {
        job_id: address,
        runner: address,
        assigned_at: u64,
    }

    public struct JobCompleted has copy, drop {
        job_id: address,
        status: u8,
        result_hash: vector<u8>,
        completed_at: u64,
    }

    public struct Job has key, store {
        id: UID,
        repo: vector<u8>,
        commit: vector<u8>,
        assigned: Option<address>,
        status: u8,
        created_at: u64,
        started_at: Option<u64>,
        completed_at: Option<u64>,
        result_hash: Option<vector<u8>>,
    }

    #[allow(unused_field)]
    public struct RepoConfig has key, store {
        id: UID,
        repo_name: vector<u8>,
        max_concurrent_jobs: u64,
        current_jobs: u64,
    }

    public entry fun create_job(
        repo: vector<u8>,
        commit: vector<u8>,
        repo_config: &mut RepoConfig,
        clock: &Clock,
        ctx: &mut TxContext,
    ) {
        assert!(repo_config.current_jobs < repo_config.max_concurrent_jobs, 0);

        let id = object::new(ctx);
        let now = clock::timestamp_ms(clock);

        let job = Job {
            id,
            repo,
            commit,
            assigned: option::none(),
            status: JOB_STATUS_QUEUED,
            created_at: now,
            started_at: option::none(),
            completed_at: option::none(),
            result_hash: option::none(),
        };

        repo_config.current_jobs = repo_config.current_jobs + 1;

        event::emit(JobCreated {
            job_id: object::uid_to_address(&job.id),
            repo,
            commit,
            created_at: now,
        });

        transfer::share_object(job);
    }

    public entry fun assign_job(
        job: &mut Job,
        runner_info: &RunnerRegistry::RunnerInfo,
        clock: &Clock,
        ctx: &mut TxContext,
    ) {
        assert!(option::is_none(&job.assigned), EJobAlreadyAssigned);
        assert!(RunnerRegistry::is_runner_active(runner_info, clock), ERunnerNotActive);

        let runner_addr = tx_context::sender(ctx);
        job.assigned = option::some(runner_addr);
        job.status = JOB_STATUS_IN_PROGRESS;

        let now = clock::timestamp_ms(clock);
        job.started_at = option::some(now);

        event::emit(JobAssigned {
            job_id: object::uid_to_address(&job.id),
            runner: runner_addr,
            assigned_at: now,
        });
    }

    public entry fun complete_job(
        job: &mut Job,
        result_hash: vector<u8>,
        success: bool,
        repo_config: &mut RepoConfig,
        clock: &Clock,
        ctx: &mut TxContext,
    ) {
        let sender = tx_context::sender(ctx);
        assert!(option::is_some(&job.assigned), EJobNotAssigned);
        assert!(option::borrow(&job.assigned) == &sender, EIncorrectAssignee);

        job.status = if (success) { JOB_STATUS_COMPLETED } else { JOB_STATUS_FAILED };
        job.result_hash = option::some(result_hash);

        let now = clock::timestamp_ms(clock);
        job.completed_at = option::some(now);

        repo_config.current_jobs = repo_config.current_jobs - 1;

        let job_id = object::uid_to_address(&job.id);
        event::emit(JobCompleted {
            job_id,
            status: job.status,
            result_hash,
            completed_at: now,
        });
    }
}

module logichain::Attestation {
    use sui::event;

    public struct AttestationCreated has copy, drop {
        attestation_id: address,
        job_id: vector<u8>,
        repo: vector<u8>,
        artifact_hash: vector<u8>,
    }

    public struct BuildAttestation has key, store {
        id: UID,
        job_id: vector<u8>,
        repo: vector<u8>,
        commit: vector<u8>,
        artifact_hash: vector<u8>,
        runner_signature: vector<u8>,
        auditor_signature: vector<u8>,
    }

    public entry fun attest_build(
        job_id: vector<u8>,
        repo: vector<u8>,
        commit: vector<u8>,
        artifact_hash: vector<u8>,
        runner_signature: vector<u8>,
        auditor_signature: vector<u8>,
        ctx: &mut TxContext,
    ) {
        let id = object::new(ctx);
        let attestation_id = object::uid_to_address(&id);

        let attestation = BuildAttestation {
            id,
            job_id,
            repo,
            commit,
            artifact_hash,
            runner_signature,
            auditor_signature,
        };

        event::emit(AttestationCreated {
            attestation_id,
            job_id,
            repo,
            artifact_hash,
        });

        transfer::share_object(attestation);
    }

    public fun verify_attestation(attestation: &BuildAttestation, expected_hash: vector<u8>): bool {
        // In a real implementation, this would:
        // 1. Verify the runner_signature against runner's public key
        // 2. Verify the auditor_signature against auditor's public key
        // 3. Check that the artifact_hash matches the expected_hash

        // Simple check for now
        attestation.artifact_hash == expected_hash
    }
}
