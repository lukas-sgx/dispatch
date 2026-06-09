const { octokit } = require("../../middleware/auth");
const label = require("../../pulls/actions/label");
const review = require("../../pulls/actions/review");

async function getMergeableState(owner, repo, pull_number) {
    const { data: pr } = await octokit.pulls.get({ owner, repo, pull_number });
    
    if (pr.mergeable !== null) return pr;
}

async function safeToMerge(owner, repo, pull_number, job) {
    const jobSucceeded = job.conclusion === "success";
    const pr = await getMergeableState(owner, repo, pull_number);
    if (!pr) return;

    if (jobSucceeded && pr.mergeable === true && ["clean", "blocked"].includes(pr.mergeable_state) != undefined) {
        await label.add(owner, repo, pr_number, [{ name: "needs: reviewer", color: "312238" }]);
        await label.add(owner, repo, pull_number, [{ name: "safe to merge", color: "05dbb4" }]);
        try {
            await review.requestReview(owner, repo, pr_number);
        } catch {}
    } else {
        await label.del(owner, repo, pull_number, ["safe to merge", "needs: reviewer"]);
        await label.add(owner, repo, pull_number, [{ name: "unsafe to merge", color: "e03849" }]);
    }
}

module.exports = { safeToMerge }