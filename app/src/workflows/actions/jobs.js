const { octokit } = require("../../middleware/auth");
const label = require("../../pulls/actions/label");

async function getMergeableState(owner, repo, pull_number, retries = 5, delay = 2000) {
    for (let i = 0; i < retries; i++) {
        const { data: pr } = await octokit.pulls.get({ owner, repo, pull_number });
        
        if (pr.mergeable !== null) return pr;
        
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    return null;
}

async function safeToMerge(owner, repo, pull_number, job) {
    const jobSucceeded = job.conclusion === "success";
    if (!jobSucceeded) return false;

    const pr = await getMergeableState(owner, repo, pull_number);
    if (!pr) return false;

    if (pr.mergeable === true && ["clean", "blocked"].includes(pr.mergeable_state) != undefined) {
        await label.add(owner, repo, pull_number, [{ name: "safe to merge", color: "05dbb4" }]);
    }
}

module.exports = { safeToMerge }