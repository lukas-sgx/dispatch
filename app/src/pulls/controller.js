const comment = require("./actions/comment");

async function handle_new_pr(pull_request, data) {
    try {
        // await comment.add(
        //     data.repository.owner.login,
        //     data.repository.name,
        //     pull_request.number,
        //     "Once the "
        // ); 
    } catch (err) {}
}

async function controller(data) {
    const pull_request = data.pull_request;
    
    if (data.action === "opened" || data.action === "reopened") {
        await handle_new_pr(pull_request, data)
    }
}

module.exports = { controller }