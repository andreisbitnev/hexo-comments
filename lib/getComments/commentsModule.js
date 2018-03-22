const sqlite3 = require('sqlite3').verbose();
function getComments (dbLocation, postName) {
    const db = new sqlite3.Database(dbLocation);
    return new Promise((resolve, reject) => {
        const sql = `SELECT json FROM comments WHERE name = ?`;
        db.all(sql, [postName], (err, rows) => {
          if (err) {
            return reject(err);
          }
          if (!rows || rows.length === 0) {
            resolve(addNewPost(dbLocation, postName));
          }
          resolve(rows[0]);
        });
    
        db.close();
    });
}
function addNewPost (dbLocation, postName) {
    const db = new sqlite3.Database(dbLocation);
    return new Promise((resolve, reject) => {
        const emptyComments = JSON.stringify({timestamp: new Date().getTime(), name: postName,comments: []});
        db.run(`INSERT INTO comments(name, json) VALUES(?, ?)`, [postName, emptyComments], function(err) {
            if (err) {
                return reject(err);
            }
            resolve(getComments(dbLocation, postName));
        });
        db.close();
    })
}
module.exports = {
    getComments
};
