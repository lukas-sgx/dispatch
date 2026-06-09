const comment = require("./actions/comment");

async function handle_new_pr(pull_request, data) {
    try {
        await comment.add(
            data.repository.owner.login,
            data.repository.name,
            pull_request.number,
            `Once the PR is merged, the deployment will be triggered automatically. Reviewers will be notified once all CI checks have passed, please make sure:

- [ ] All tests pass locally
- [ ] The description clearly explains the changes
- [ ] Related issues are linked (closes #...)
- [ ] No debug code or TODOs left behind

Thanks for your contribution!`
        ); 
    } catch (err) {}
}

async function controller(data) {
    const pull_request = data.pull_request;
    
    if (data.action === "opened" || data.action === "reopened") {
        await handle_new_pr(pull_request, data)
    }
}

module.exports = { controller }