const sqlite3 = require('sqlite3').verbose();
const DBSOURCE = 'database/contacts.sqlite';

const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');
        db.run(
            `CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        address TEXT,
        email TEXT,
        phone TEXT,
        cell TEXT,
        reg_date TEXT,
        age INTEGER,
        image TEXT
      );`,
            (err) => {
                if (err) {
                    console.log('Contacts table already exists.');
                } else {
                    console.log('Contacts table created.');
                }
            }
        );
    }
});

module.exports = db;
