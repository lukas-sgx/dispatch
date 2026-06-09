const comment = require("./actions/comment");

async function handle_new_pr(pull_request, data) {
    await comment.add(
        data.repository.owner.login,
        data.repository.name,
        pull_request.number,
        "New PR, don't forget to add reviewers."
    );
}

async function controller(data) {
    const pull_request = data.pull_request;
    
    if (data.action === "opened" || data.action === "reopened") {
        await handle_new_pr(pull_request, data)
    }
}

module.exports = { controller }