const templatesModule = require("./templatesModule");
module.exports = (templates, providers) => {
    return (req, res) => {
        const user = req.user && req.user.display_name || null;
        templatesModule.render(req.json, templates, user, providers)
        .then((html) => {
            res.send(html)
        })
        .catch((err) => {
            return err;
        });
    }
}