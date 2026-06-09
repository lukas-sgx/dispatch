const express = require('express');
const pull_request = require('./pulls/controller')
const workflow = require('./workflows/controller')
const app = express();
const port = 58925;

app.use(express.json());

app.post('/', async (req, res) => {
    if (req.body.pull_request != undefined) {
        await pull_request.controller(req.body)
    }
    if (req.body.workflow_job != undefined) {
        workflow.controller(req.body)
    }
    res.send("Receive request");
});

app.listen(port, () => {
    console.log(`Dispatch app listening on port ${port}`);
});