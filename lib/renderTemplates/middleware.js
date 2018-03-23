const templatesModule = require("./templatesModule");
module.exports = (templates, defaults) => {
    return (req, res) => {
        const user = req.user || null;
        templatesModule.render(req.json, templates, user, defaults)
        .then((html) => {
            res.send(html)
        })
        .catch((err) => {
            return err;
        });
    }
}