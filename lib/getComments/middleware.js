const commentsModule = require("./commentsModule");
module.exports = (db, log) => {
    return (req, res, next) => {
        const postName = req.params.postName;
        commentsModule.getComments(db, postName, log)
        .then((result) => {
            req.json = result.json;
            next();
        })
        .catch((err) => {
            next(err);
        });
    }
}