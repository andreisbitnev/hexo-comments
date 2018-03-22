const commentModule = require("./commentModule");
module.exports = (templates) => {
    return (req, res, next) => {
        const schema = require(templates.comment);
        commentModule.createComment(req.json, req.body, schema, req.user)
        .then((updatedJson) => {
            req.json = updatedJson;
            next();
        })
        .catch((err) => {
            console.log(err.message);
        });
    }
}