const db = require('../database.js');

const Course = {
    create: (name, description, userId, weight = 10, difficulty = 3, color = '#3b82f6') => {
        const sql = 'INSERT INTO courses (name, description, userId, weight, difficulty, color) VALUES (?, ?, ?, ?, ?, ?)';
        return new Promise((resolve, reject) => {
            db.run(sql, [name, description, userId, weight, difficulty, color], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, name, description, userId, weight, difficulty, color });
                }
            });
        });
    },

    update: (id, userId, updates) => {
        const fields = [];
        const values = [];
        const allowed = ['name', 'description', 'weight', 'difficulty', 'color'];
        for (const key of allowed) {
            if (updates[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(updates[key]);
            }
        }
        if (fields.length === 0) return Promise.resolve(null);
        const sql = `UPDATE courses SET ${fields.join(', ')} WHERE id = ? AND userId = ?`;
        values.push(id, userId);
        return new Promise((resolve, reject) => {
            db.run(sql, values, function(err) {
                if (err) return reject(err);
                if (this.changes === 0) return resolve(null);
                Course.findById(id, userId).then(resolve).catch(reject);
            });
        });
    },

    delete: (id, userId) => {
        const sql = 'DELETE FROM courses WHERE id = ? AND userId = ?';
        return new Promise((resolve, reject) => {
            db.run(sql, [id, userId], function(err) {
                if (err) return reject(err);
                resolve(this.changes > 0);
            });
        });
    },

    findById: (id, userId) => {
        const sql = 'SELECT * FROM courses WHERE id = ? AND userId = ?';
        return new Promise((resolve, reject) => {
            db.get(sql, [id, userId], (err, row) => {
                if (err) return reject(err);
                resolve(row || null);
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