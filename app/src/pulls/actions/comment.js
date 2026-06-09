const { octokit } = require('../../middleware/auth');

async function add(owner, repo, pull_number, comment) {
    const { data } = await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: pull_number,
        body: comment
    });

    return data;
}

module.exports = { add };