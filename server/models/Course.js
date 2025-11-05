const db = require('../database.js');

const Course = {
    create: (name, description, userId) => {
        const sql = 'INSERT INTO courses (name, description, userId) VALUES (?, ?, ?)';
        return new Promise((resolve, reject) => {
            db.run(sql, [name, description, userId], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, name, description, userId });
                }
            });
        });
    },

    findByUserId: (userId) => {
        const sql = 'SELECT * FROM courses WHERE userId = ?';
        return new Promise((resolve, reject) => {
            db.all(sql, [userId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
};

module.exports = Course;