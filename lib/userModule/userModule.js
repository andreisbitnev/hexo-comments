const sqlite3 = require('sqlite3').verbose();
let db, log;

function init(dbLocation, logger) {
    db = new sqlite3.Database(dbLocation);
    log = logger;
}

function findUser(provider, id) {
    const sql = `SELECT id, name, display_name, provider, provider_id FROM users WHERE provider = ? AND provider_id = ?`;  
    return new Promise((resolve, reject) => {
        db.all(sql, [provider, id], (err, rows) => {
            if (err) {
                return reject(err);
            }
            if (!rows || rows.length === 0) {
                resolve(null);
            }else{
                resolve(rows[0]);
            }
        });
    });
    db.close();
}

function saveUser(data) {
    const sql = `INSERT INTO users (provider, provider_id, display_name, name) VALUES (?, ?, ?, ?)`;
    return new Promise((resolve, reject) => {
        db.run(sql, [data.provider, data.id, data.displayName, data.username || data.displayName], (err, rows) => {
            if (err) {
                return reject(err);
            }
            log.info(`New user - ${data.displayName} added`);
            resolve();
        });
    });
}

async function getUser(userData) {
    try{
        let result = await findUser(userData.provider, userData.id);
        if(!result) {
            log.info(`User - ${userData.displayName} not yet registered`);
            await saveUser(userData);
            result = await findUser(userData.provider, userData.id)
        }
        return result
    } catch(error) {
        log.error(error);
        return null
    }
}

module.exports = {
    init,
    getUser,
    findUser
}