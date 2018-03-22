function updateComments (dbLocation, postName, data) {
    return new Promise((resolve, reject) => {
        const sqlite3 = require('sqlite3').verbose();
        let db = new sqlite3.Database(dbLocation);
     
        db.run(`UPDATE comments set json = ? WHERE name = ?`, [data, postName], function(err) {
            if (err) {
                return reject(err);
            }
            resolve();
        });
        db.close();
    })
}
module.exports = {
    updateComments
};
