const { octokit } = require('../../middleware/auth');

async function prIsMerged(owner, repo, pull_number) {
    try {
        await octokit.rest.pulls.checkIfMerged({
            owner: owner,
            repo: repo,
            pull_number: pull_number
        });
        return true;
    } catch (err) {
        if (err.status === 404) {
            return false;
        }
        throw err;
    }
}

module.exports = { prIsMerged };