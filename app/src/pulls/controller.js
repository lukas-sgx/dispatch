const comment = require("./actions/comment");
const review = require("./actions/review");

async function handle_new_pr(pull_request, data) {
    await review.requestReview(
        data.repository.owner.login,
        data.repository.name,
        pull_request.number
    );
}

async function controller(data) {
    const pull_request = data.pull_request;
    
    if (data.action === "opened" || data.action === "reopened") {
        await handle_new_pr(pull_request, data)
    }
}

module.exports = { controller }