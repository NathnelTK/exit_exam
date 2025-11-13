const db = require('../database.js');

const StudyPlan = {
    create: (courseId, title, scheduledDate, userId) => {
        const sql = 'INSERT INTO study_plans (courseId, title, scheduledDate, userId) VALUES (?, ?, ?, ?)';
        return new Promise((resolve, reject) => {
            db.run(sql, [courseId, title, scheduledDate, userId], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, courseId, title, scheduledDate, userId });
                }
            });
        });
    },

    findByUserId: (userId) => {
        const sql = 'SELECT * FROM study_plans WHERE userId = ?';
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

module.exports = StudyPlan;