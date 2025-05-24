// ============ LogiToken Module ============
module logichain::LogiToken {
  use sui::object::{Self, UID};
  use sui::balance::{Self, Balance};
  use sui::coin::{Self, Coin, TreasuryCap, CoinMetadata};
  use sui::transfer;
  use sui::tx_context::{Self, TxContext};
  use std::string::{Self, String};

  /// One-time witness for the coin
  public struct LOGITOKEN has drop {}

  /// The total supply object for LogiToken
  public struct Supply has key {
    id: UID,
    total: u64,
  }

  /// Initialize the token: create Supply and mint to creator
  fun init(witness: LOGITOKEN, ctx: &mut TxContext) {
    let (treasury_cap, metadata) = coin::create_currency<LOGITOKEN>(
      witness,
      9, // decimals
      b"LOGI", // symbol
      b"LogiChain Token", // name
      b"LogiChain protocol governance token", // description
      option::none(), // icon url
      ctx
    );

    let supply = Supply { 
      id: object::new(ctx),
      total: 0
    };
    
    // Share the supply object
    transfer::share_object(supply);
    
    // Transfer the treasury cap to the sender
    transfer::public_transfer(treasury_cap, tx_context::sender(ctx));
    
    // Share the metadata so anyone can see it
    transfer::public_share_object(metadata);
  }

  /// Mint new tokens (governance only)
  public entry fun mint(
    treasury_cap: &mut TreasuryCap<LOGITOKEN>,
    amount: u64, 
    recipient: address,
    ctx: &mut TxContext
  ) {
    let coin = coin::mint<LOGITOKEN>(treasury_cap, amount, ctx);
    transfer::public_transfer(coin, recipient);
    
    // Update supply - would need reference to shared Supply object
    // This would need to be implemented via Supply object lookup
  }

  /// Burn tokens from sender
  public entry fun burn(
    treasury_cap: &mut TreasuryCap<LOGITOKEN>,
    coin_to_burn: Coin<LOGITOKEN>
  ) {
    let amount = coin::value(&coin_to_burn);
    coin::burn(treasury_cap, coin_to_burn);
    
    // Update supply - would need reference to shared Supply object
  }
}

  // ============ RunnerRegistry Module ============
  module logichain::RunnerRegistry {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::coin::{Self, Coin}; // Use Coin instead of Balance
    use sui::tx_context::{Self, TxContext};
    use sui::clock::{Self, Clock}; // Replace Timestamp with Clock
    
    // Add reference to your LogiToken module with LOGITOKEN type
    use logichain::LogiToken::{Self, LOGITOKEN};

    public struct RunnerInfo has key, store {
      id: UID,
      operator: address,
      stake: u64,
      last_beat: u64,
    }

    /// Register a runner by staking tokens
    public entry fun register_runner(
      stake_coin: Coin<LOGITOKEN>,
      clock: &Clock,
      ctx: &mut TxContext
    ) {
      let stake_amt = coin::value(&stake_coin);
      
      // Store the coins somewhere or burn them
      // For example, transfer to module creator
      transfer::public_transfer(stake_coin, tx_context::sender(ctx));

      let id = object::new(ctx);
      let now = clock::timestamp_ms(clock);
      let info = RunnerInfo {
        id,
        operator: tx_context::sender(ctx),
        stake: stake_amt,
        last_beat: now,
      };
      
      // Share the runner info object
      transfer::share_object(info);
    }

    /// Heartbeat to update liveness
    public entry fun heartbeat(
      runner_info: &mut RunnerInfo,
      clock: &Clock,
      ctx: &mut TxContext
    ) {
      // Verify sender is the operator
      assert!(runner_info.operator == tx_context::sender(ctx), 1);
      runner_info.last_beat = clock::timestamp_ms(clock);
    }

    /// Slash stake for misbehavior
    public entry fun slash(
      runner_info: &mut RunnerInfo,
      amount: u64,
      ctx: &mut TxContext
    ) {
      // Omitted: access control check - would need a capability object
      assert!(runner_info.stake >= amount, 1);
      runner_info.stake = runner_info.stake - amount;
      // Slashed tokens could go to treasury
    }
  }

  // ============ JobQueue Module ============
  module logichain::JobQueue {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::option::{Self, Option};

    public struct Job has key, store {
      id: UID,
      repo: vector<u8>,
      commit: vector<u8>,
      assigned: Option<address>,
    }

    /// Create a new job from Wormhole VAA
    public entry fun create_job(
      repo: vector<u8>,
      commit: vector<u8>,
      ctx: &mut TxContext
    ) {
      let id = object::new(ctx);
      let job = Job {
        id,
        repo,
        commit,
        assigned: option::none(),
      };
      
      // Share the job object so runners can find it
      transfer::share_object(job);
    }

    /// Runner claims a job
    public entry fun assign_job(
      job: &mut Job,
      ctx: &mut TxContext
    ) {
      // Check if job is already assigned
      assert!(option::is_none(&job.assigned), 2);
      // Assign to the sender
      job.assigned = option::some(tx_context::sender(ctx));
    }

    /// Runner completes job, logs result
    public entry fun complete_job(
      job: &mut Job,
      result: vector<u8>,
      ctx: &mut TxContext
    ) {
      // Verify sender is the assigned runner
      let sender = tx_context::sender(ctx);
      assert!(option::is_some(&job.assigned) && 
             option::borrow(&job.assigned) == &sender, 3);
      
      // In Sui, we don't destroy objects like this
      // Instead we would typically:
      // 1. Update the job status
      // 2. Create a completion record
      // 3. Optionally transfer rewards
      
      // For now, just update the job (we can't easily delete shared objects)
      // We could mark it as completed with a status field
    }
  }

  // ============ Attestation Module ============
  module logichain::Attestation {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::vector;

    public struct BuildRecord has key, store {
      id: UID,
      job_id: vector<u8>,
      runner_sig: vector<u8>,
      auditor_sig: vector<u8>,
    }

    /// Record co-signed build proof
    public entry fun attest_build(
      job_id: vector<u8>,
      runner_sig: vector<u8>,
      auditor_sig: vector<u8>,
      ctx: &mut TxContext
    ) {
      let id = object::new(ctx);
      let rec = BuildRecord { id, job_id, runner_sig, auditor_sig };
      
      // Share the attestation record so it's publicly accessible
      transfer::share_object(rec);
    }
  }

