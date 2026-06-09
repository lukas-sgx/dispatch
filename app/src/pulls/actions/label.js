const { octokit } = require("../../middleware/auth");

async function is_exist(owner, repo, label_name) {
    try {
        const { data } = await octokit.rest.issues.getLabel({
            owner: owner,
            repo: repo,
            name: label_name
        });
        return data;
    } catch (err) {}
}

async function make(owner, repo, label) {
    const color = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
    
    await octokit.rest.issues.createLabel({
        owner: owner,
        repo: repo,
        name: label?.name,
        color: label?.color ?? color
    })
}

async function add(owner, repo, pull_number, labels) {
    for (const label of labels) {
        if (await is_exist(owner, repo, label) == undefined) {
            await make(owner, repo, label)
        }
    }
    
    await octokit.rest.issues.addLabels({
        owner: owner,
        repo: repo,
        issue_number: pull_number,
        labels: labels.map(label => label.name)
    })
}

module.exports = { add }