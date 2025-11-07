const db = require('../database.js');

const NotificationSubscription = {
    create: (userId, subscription) => {
        const sql = 'INSERT INTO notifications (userId, subscription) VALUES (?, ?)';
        return new Promise((resolve, reject) => {
            db.run(sql, [userId, JSON.stringify(subscription)], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, userId, subscription });
                }
            });
        });
    },

    findByUserId: (userId) => {
        const sql = 'SELECT * FROM notifications WHERE userId = ?';
        return new Promise((resolve, reject) => {
            db.all(sql, [userId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows.map(row => ({...row, subscription: JSON.parse(row.subscription)})));
                }
            });
        });
    },

    findAll: () => {
        const sql = 'SELECT * FROM notifications';
        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows.map(row => ({...row, subscription: JSON.parse(row.subscription)})));
            });
        });
    },

    deleteById: (id) => {
        const sql = 'DELETE FROM notifications WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.run(sql, [id], function(err) {
                if (err) return reject(err);
                resolve(this.changes > 0);
            });
        });
    }
};

module.exports = NotificationSubscription;