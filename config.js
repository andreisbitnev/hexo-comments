module.exports = {
    port: 4000,
    securePort: undefined,
    database: 'main.db',
    errorLogs: 'errors.log',
    defaults: {
        name: "Guest",
        providers: []
    },
    ssl: {
        key: 'key.pem',
        cert: 'cert.pem',
        passphrase: undefined
    },
    auth: {
        secret: 'secret key for session / any random string',
        google: {
            clientID: undefined,
            clientSecret: undefined
        },
        facebook: {
            clientID: undefined,
            clientSecret: undefined
        }
    },
    templates: {
        container: "container.ejs",
        comments: "comments.ejs",
        comment: "comment.js"
    }
};