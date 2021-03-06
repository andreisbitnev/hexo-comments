const http = require('http');
const https = require('https');
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const config = require("./config");
const bodyParser = require('body-parser');
const db = path.join(__dirname, config.database);
const auth = require("./auth");
let templates = config.templates;
Object.entries(templates).forEach(([key, value]) => {
    templates[key] = path.join(__dirname, 'templates', value);
});
const getComments = require("./lib/getComments/middleware");
const renderTemplates = require("./lib/renderTemplates/middleware");
const postComment = require("./lib/postComment/middleware");
const createComment = require("./lib/createComment/middleware");
const errorHandling = require("./lib/errorHandling/middleware");
const log = require("./logger");

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, '/../public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if(config.auth.facebook.clientID && config.auth.facebook.clientSecret ||
    config.auth.google.clientID && config.auth.google.clientSecret) {
    app.use(auth.app);
}

app.get('/comments/:postName', [
    getComments(db, log),
    renderTemplates(templates, config.defaults)
]);

app.post('/comments/:postName', [
    getComments(db),
    createComment(templates),
    postComment(db)
]);

app.use(errorHandling(log));

if(config.port) {
    http.createServer(app).listen(config.port, () => {
        console.log(`server running on port ${config.port}`);
    });
}
if(config.securePort) {
    let credentials = {
        key: fs.readFileSync(config.ssl.key),
        cert: fs.readFileSync(config.ssl.cert)
    }
    if (config.ssl.passphrase) {
        credentials.passphrase = config.ssl.passphrase
    }
    https.createServer(credentials, app).listen(config.securePort, () => {
        console.log(`secure server running on port ${config.securePort}`);
    });
}