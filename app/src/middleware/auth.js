const { createAppAuth } = require("@octokit/auth-app");
const { Octokit } = require("@octokit/rest");
const dotenv = require("dotenv");

dotenv.config({ path: "src/.env" })

const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
        appId: process.env.APP_ID,
        privateKey: process.env.PRIVATE_KEY,
        installationId: process.env.INSTALLATION_ID,
    },
});

module.exports = { octokit };