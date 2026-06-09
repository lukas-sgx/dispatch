const { octokit } = require("../../middleware/auth");
const comment = require("../actions/comment");
const { minimatch } = require('minimatch');

function parseCODEOWNERS(content) {
    return content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'))
        .map(line => {
            const [pattern, ...owners] = line.split(/\s+/);
            return { pattern, owners };
        });
}

function getOwnersForFile(filePath, rules) {
    let matched = [];

    for (const rule of rules) {
        const pattern = rule.pattern.startsWith('/')
            ? rule.pattern.slice(1)
            : `**/${rule.pattern}`;
        if (minimatch(filePath, pattern, { matchBase: true, dot: true })) {
            matched = rule.owners;
        }
    }
    return matched;
}

async function getCODEOWNERS(owner, repo, ref = "HEAD") {
    const paths = ["CODEOWNERS", ".github/CODEOWNERS", "docs/CODEOWNERS"];

    try {
        const { data } = await octokit.rest.repos.codeownersErrors({ owner, repo, ref });
        if (data.errors.length > 0) {
            await octokit.rest.issues.create({
                owner,
                repo,
                title: "[BUG] Syntax error on CODEOWNERS",
                body: `## Bug Report
### Description
An error was detected in the \`CODEOWNERS\` file. One or more entries may be invalid, causing code ownership rules to not be applied correctly.

### Actual Behavior
\`\`\`
${data.errors.map((err) => `Line ${err.line}: ${err.message} (${err.path})`).join('\n')}
\`\`\`

### Environment
- Repository: \`${owner}/${repo}\`

> This issue was automatically generated.`,
                labels: ["bug"],
            });
        }
    } catch (err) {
        if (err.status !== 404) throw err;
        return undefined;
    }

    for (const path of paths) {
        try {
            const { data } = await octokit.rest.repos.getContent({ owner, repo, path, ref });
            const content = Buffer.from(data.content, "base64").toString("utf-8");
            
            return parseCODEOWNERS(content);
        } catch (err) {}
    }

    return undefined;
}

async function requestReview(owner, repo, pull_number) {
    const rules = await getCODEOWNERS(owner, repo, "HEAD");

    if (rules === undefined) {
        await comment.add(
            owner,
            repo,
            pull_number,
            "You must define codeowners in the repository.\nReference: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners",
        );
        return;
    }

    const { data: files } = await octokit.rest.pulls.listFiles({
        owner,
        repo,
        pull_number,
    });

    const reviewers = [...new Set(
        files.flatMap(file => getOwnersForFile(file.filename, rules))
    )].map(r => r.replace(/^@/, '').replace(`${owner}/`, ''));

    if (reviewers.length === 0) return;

    await octokit.rest.pulls.requestReviewers({
        owner,
        repo,
        pull_number,
        reviewers,
    });
}

module.exports = { requestReview };