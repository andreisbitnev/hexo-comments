module.exports = {
    domain: 'example.com',
    port: 4000,
    database: 'main.db',
    templates: {
        container: "container.ejs",
        comments: "comments.ejs",
        comment: "comment.js"
    },
    commentDefault: {
        name: "Guest"
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
        },
        providers: []
    },
    errorLogs: 'errors.log',
};