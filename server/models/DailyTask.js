const db = require('../database.js');

const DailyTask = {
    create: (studyPlanId, task, userId, allocatedMinutes = 0, date = null, courseId = null) => {
        const sql = 'INSERT INTO daily_tasks (studyPlanId, task, userId, allocatedMinutes, completedMinutes, date, courseId, completed) VALUES (?, ?, ?, ?, ?, ?, ?, 0)';
        return new Promise((resolve, reject) => {
            db.run(sql, [studyPlanId, task, userId, allocatedMinutes, 0, date, courseId], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, studyPlanId, task, userId, allocatedMinutes, completedMinutes: 0, date, courseId, completed: 0 });
                }
            });
        });
    },

    updateById: (id, userId, updates) => {
        const fields = [];
        const values = [];
        const allowed = ['completed', 'completedMinutes', 'allocatedMinutes'];
        for (const key of allowed) {
            if (updates[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(updates[key]);
            }
        }
        if (fields.length === 0) return Promise.resolve(null);
        const sql = `UPDATE daily_tasks SET ${fields.join(', ')} WHERE id = ? AND userId = ?`;
        values.push(id, userId);
        return new Promise((resolve, reject) => {
            db.run(sql, values, function(err) {
                if (err) return reject(err);
                if (this.changes === 0) return resolve(null);
                DailyTask.findById(id, userId).then(resolve).catch(reject);
            });
        });
    },

    findById: (id, userId) => {
        const sql = 'SELECT * FROM daily_tasks WHERE id = ? AND userId = ?';
        return new Promise((resolve, reject) => {
            db.get(sql, [id, userId], (err, row) => {
                if (err) return reject(err);
                resolve(row || null);
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
    },

    findTodayByUserIdWithCourse: (userId, dateStr) => {
        const sql = `
            SELECT dt.*, c.name as courseName, c.color as courseColor, c.id as cId
            FROM daily_tasks dt
            LEFT JOIN courses c ON c.id = dt.courseId
            WHERE dt.userId = ? AND dt.date = ?
        `;
        return new Promise((resolve, reject) => {
            db.all(sql, [userId, dateStr], (err, rows) => {
                if (err) return reject(err);
                resolve(rows.map(r => ({
                    _id: r.id,
                    studyPlanId: r.studyPlanId,
                    task: r.task,
                    completed: !!r.completed,
                    userId: r.userId,
                    allocatedMinutes: r.allocatedMinutes || 0,
                    completedMinutes: r.completedMinutes || 0,
                    date: r.date,
                    courseId: r.courseId ? { _id: r.cId, name: r.courseName, color: r.courseColor } : null
                })));
            });
        });
    },

    deleteForDate: (userId, dateStr) => {
        const sql = `DELETE FROM daily_tasks WHERE userId = ? AND date = ?`;
        return new Promise((resolve, reject) => {
            db.run(sql, [userId, dateStr], function(err) {
                if (err) return reject(err);
                resolve(this.changes || 0);
            });
        });
    }
};

module.exports = DailyTask;