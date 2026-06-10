const { octokit } = require("../../middleware/auth");
const label = require("../../pulls/actions/label");

async function getMergeableState(owner, repo, pull_number) {
    const { data: pr } = await octokit.pulls.get({ owner, repo, pull_number });
    
    if (pr.mergeable !== null) return pr;
}

async function safeToMerge(owner, repo, pull_number, job) {
    const jobSucceeded = job.conclusion === "success";
    const pr = await getMergeableState(owner, repo, pull_number);
    if (!pr) return;

    if (jobSucceeded && pr.mergeable === true && ["clean", "blocked"].includes(pr.mergeable_state) != undefined) {
        await label.del(owner, repo, pull_number, ["unsafe to merge"]);
        await label.add(owner, repo, pull_number, [{ name: "needs: reviewer", color: "312238" }]);
        await label.add(owner, repo, pull_number, [{ name: "safe to merge", color: "05dbb4" }]);
    } else {
        await label.del(owner, repo, pull_number, ["safe to merge", "needs: reviewer"]);
        await label.add(owner, repo, pull_number, [{ name: "unsafe to merge", color: "e03849" }]);
    }
}

module.exports = { safeToMerge }