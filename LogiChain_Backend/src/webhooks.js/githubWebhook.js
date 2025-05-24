const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { Queue } = require('../services/queue');
const { PipelineRunner } = require('../services/pipelineRunner');
const { Notification } = require('../services/notification');
const { Repository } = require('../models/repository');
const logger = require('../utils/logger');

const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || 'your_secret_here';


router.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

function verifySignature(req) {
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) return false;

  const hmac = crypto.createHmac('sha256', GITHUB_WEBHOOK_SECRET);
  const digest = 'sha256=' + hmac.update(req.rawBody).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

function getBranchFromRef(ref) {
  return ref.replace('refs/heads/', '');
}


async function shouldRunPipeline(repository, branch, event) {
  try {
    const repo = await Repository.findOne({ name: repository });
    if (!repo) return false;


    const branchConfig = repo.branches.find(b => b.name === branch);
    if (!branchConfig) return repo.defaultBranchConfig?.enabled || false;

    return branchConfig.enabled;
  } catch (error) {
    logger.error(`Error checking pipeline configuration: ${error.message}`);
    return false;
  }
}


async function schedulePipeline(jobData) {
  try {
    await Queue.add('pipeline', jobData, {
      priority: jobData.priority || 'normal',
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000
      }
    });
    logger.info(`Pipeline job scheduled for ${jobData.repository}:${jobData.branch}`);
    return true;
  } catch (error) {
    logger.error(`Failed to schedule pipeline: ${error.message}`);
    return false;
  }
}


async function handlePushEvent(payload) {
  const repository = payload.repository.full_name;
  const ref = payload.ref;
  const branch = getBranchFromRef(ref);
  const commit = payload.head_commit;
  
  logger.info(`Push event on ${repository} to ${branch}: ${commit.message}`);
  
  const shouldRun = await shouldRunPipeline(repository, branch, 'push');
  if (!shouldRun) {
    logger.info(`Skipping pipeline for ${repository}:${branch} - not configured for CI/CD`);
    return false;
  }


  const commitDetails = {
    id: commit.id,
    message: commit.message,
    author: commit.author.name,
    timestamp: commit.timestamp,
    url: commit.url
  };


  return await schedulePipeline({
    type: 'build',
    trigger: 'push',
    repository,
    branch,
    commit: commitDetails,
    priority: branch === 'main' || branch === 'master' ? 'high' : 'normal'
  });
}


async function handlePullRequestEvent(payload) {
  const action = payload.action;
  if (!['opened', 'synchronize', 'reopened'].includes(action)) {
    logger.info(`Ignoring pull request ${action} event`);
    return false;
  }

  const repository = payload.repository.full_name;
  const prNumber = payload.pull_request.number;
  const headBranch = payload.pull_request.head.ref;
  const baseBranch = payload.pull_request.base.ref;
  const title = payload.pull_request.title;

  logger.info(`Pull request #${prNumber} ${action}: ${title} (${headBranch} → ${baseBranch})`);

  const shouldRun = await shouldRunPipeline(repository, headBranch, 'pull_request');
  if (!shouldRun) {
    logger.info(`Skipping pipeline for PR #${prNumber} - not configured for CI/CD`);
    return false;
  }

  return await schedulePipeline({
    type: 'pr_check',
    trigger: 'pull_request',
    repository,
    prNumber,
    headBranch,
    baseBranch,
    title,
    priority: 'high'
  });
}


async function handleIssueEvent(payload) {
  const action = payload.action;
  const repository = payload.repository.full_name;
  const issueNumber = payload.issue.number;
  const title = payload.issue.title;

  logger.info(`Issue #${issueNumber} ${action}: ${title}`);


  await Notification.send({
    type: 'issue',
    action,
    repository,
    issueNumber,
    title,
    url: payload.issue.html_url
  });

  return true;
}


router.post('/github/webhook', async (req, res) => {
  try {

    if (!verifySignature(req)) {
      logger.warn('Webhook signature verification failed');
      return res.status(401).send('Signature mismatch');
    }

    const event = req.headers['x-github-event'];
    const payload = req.body;
    const deliveryId = req.headers['x-github-delivery'];

    logger.info(`Received GitHub event: ${event} (${deliveryId})`);

    let success = false;


    res.status(202).send('Webhook received and being processed');
    

    switch (event) {
      case 'push':
        success = await handlePushEvent(payload);
        break;
      
      case 'pull_request':
        success = await handlePullRequestEvent(payload);
        break;
        
      case 'issues':
        success = await handleIssueEvent(payload);
        break;
        
      case 'ping':
        logger.info(`Ping received from GitHub`);
        success = true;
        break;
        
      default:
        logger.info(`Unhandled event type: ${event}`);
        break;
    }

    logger.info(`Processed ${event} event ${success ? 'successfully' : 'with issues'}`);
    

    if (success && (event === 'push' || event === 'pull_request')) {
      try {
        await PipelineRunner.executeImmediate({
          event,
          payload,
          deliveryId
        });
      } catch (error) {
        logger.error(`Error in immediate pipeline execution: ${error.message}`);
      }
    }

  } catch (error) {
    logger.error(`Error processing webhook: ${error.message}`);

  }
});


router.get('/github/webhook/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;