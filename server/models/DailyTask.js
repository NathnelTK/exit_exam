const db = require('../database.js');

const DailyTask = {
    create: (studyPlanId, task, userId) => {
        const sql = 'INSERT INTO daily_tasks (studyPlanId, task, userId) VALUES (?, ?, ?)';
        return new Promise((resolve, reject) => {
            db.run(sql, [studyPlanId, task, userId], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, studyPlanId, task, userId });
                }
            });
        });
    },

    findByUserId: (userId) => {
        const sql = 'SELECT * FROM daily_tasks WHERE userId = ?';
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

module.exports = DailyTask;