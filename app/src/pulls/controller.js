const comment = require("./actions/comment");
const review = require("./actions/review");
const label = require("./actions/label");

async function handle_new_pr(pull_request, data) {
    try {
        await label.add(
            data.repository.owner.login,
            data.repository.name,
            pull_request.number,
            "need-reviewer"
        );
        await review.requestReview(
            data.repository.owner.login,
            data.repository.name,
            pull_request.number
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