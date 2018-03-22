const path = require("path");
const config = require("./config");
const log = require('bunyan').createLogger({
    name: 'cmt',
    streams: [
        {
            level: 'error',
            path: path.join(__dirname, config.errorLogs) 
        },
        {
            stream: process.stdout
        }
    ]
});
module.exports = log;