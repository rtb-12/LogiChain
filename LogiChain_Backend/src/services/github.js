const simpleGit = require('simple-git');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const os = require('os');

/**
 * Clones a GitHub repository and runs a build command
 * @param {String} repoUrl - The GitHub repo URL
 * @param {String} branch - The branch to checkout
 * @param {String} buildCommand - The command to build the project
 * @returns {Promise<{ success: boolean, output?: string, error?: string, artifactsPath?: string }>}
 */
async function cloneAndBuild(repoUrl, branch = 'main', buildCommand = 'npm install && npm run build') {
  const tempDir = path.join(os.tmpdir(), `logichain_build_${Date.now()}`);
  const repoDir = path.join(tempDir, 'repo');

  try {

    await simpleGit().clone(repoUrl, repoDir, ['--branch', branch]);

    return new Promise((resolve, reject) => {
      exec(buildCommand, { cwd: repoDir, maxBuffer: 1024 * 500 }, async (error, stdout, stderr) => {
        if (error) {
          console.error(`Build failed: ${stderr}`);
          await fs.remove(tempDir);
          return resolve({ success: false, error: stderr });
        }


        const distPath = path.join(repoDir, 'dist');
        const buildPath = path.join(repoDir, 'build');
        const artifactsPath = (await fs.pathExists(distPath)) ? distPath : buildPath;

        if (!await fs.pathExists(artifactsPath)) {
          await fs.remove(tempDir);
          return resolve({ success: false, error: 'No build artifacts found.' });
        }


        const finalArtifactsPath = path.join(tempDir, 'artifacts');
        await fs.copy(artifactsPath, finalArtifactsPath);


        await fs.remove(repoDir);

        resolve({ success: true, output: stdout, artifactsPath: finalArtifactsPath });
      });
    });

  } catch (err) {
    console.error(`Error during clone/build: ${err.message}`);
    await fs.remove(tempDir);
    return { success: false, error: err.message };
  }
}

module.exports = { cloneAndBuild };
