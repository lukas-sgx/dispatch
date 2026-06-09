const { octokit } = require("../middleware/auth");
const jobs_runner = require("./actions/jobs");

const runningJobs = new Map();

async function controller(data) {
    const job = data.workflow_job;
    const run_id = job.run_id;
    const owner = data.repository.owner.login;
    const repo = data.repository.name;

    if (data.action === "queued") {
        if (!runningJobs.has(run_id)) runningJobs.set(run_id, new Set());
        runningJobs.get(run_id).add(job.id);
        return;
    }

    if (data.action === "completed") {
        const jobs = runningJobs.get(run_id);
        if (!jobs) return;

        jobs.delete(job.id);

        if (jobs.size === 0) {
            runningJobs.delete(run_id);

            const { data: pulls } = await octokit.repos.listPullRequestsAssociatedWithCommit({
                owner,
                repo,
                commit_sha: job.head_sha,
            });

            if (pulls.length === 0) return;
            const pr_number = pulls[0].number;

            await jobs_runner.safeToMerge(owner, repo, pr_number, job)
        }
    }
}

module.exports = { controller };