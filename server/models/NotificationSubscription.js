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
    }
};

module.exports = NotificationSubscription;