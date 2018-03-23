module.exports = {
    port: 4000,
    database: 'main.db',
    errorLogs: 'errors.log',
    defaults: {
        name: "Guest",
        providers: []
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