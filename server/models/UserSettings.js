const db = require('../database.js');

const UserSettings = {
  upsert: (userId, data) => {
    // store customization as JSON string
    const customizationStr = data.customization ? JSON.stringify(data.customization) : null;

    return new Promise((resolve, reject) => {
      // Try update first
      const updateSql = `UPDATE user_settings SET examDate = ?, title = ?, dailyStudyHours = ?, notificationTime = ?, customization = ? WHERE userId = ?`;
      db.run(updateSql, [data.examDate || null, data.title || null, data.dailyStudyHours || null, data.notificationTime || null, customizationStr, userId], function(err) {
        if (err) return reject(err);

        if (this.changes && this.changes > 0) {
          // updated existing row
          resolve({ userId, ...data });
        } else {
          // insert new row
          const insertSql = `INSERT INTO user_settings (userId, examDate, title, dailyStudyHours, notificationTime, customization) VALUES (?, ?, ?, ?, ?, ?)`;
          db.run(insertSql, [userId, data.examDate || null, data.title || null, data.dailyStudyHours || null, data.notificationTime || null, customizationStr], function(err2) {
            if (err2) return reject(err2);
            resolve({ userId, id: this.lastID, ...data });
          });
        }
      });
    });
  },

  findByUserId: (userId) => {
    const sql = `SELECT * FROM user_settings WHERE userId = ?`;
    return new Promise((resolve, reject) => {
      db.get(sql, [userId], (err, row) => {
        if (err) return reject(err);
        if (!row) return resolve(null);

        // parse customization JSON if present
        try {
          const customization = row.customization ? JSON.parse(row.customization) : null;
          resolve({ examDate: row.examDate, title: row.title, dailyStudyHours: row.dailyStudyHours, notificationTime: row.notificationTime, customization });
        } catch (e) {
          // if parse fails just return raw customization
          resolve({ examDate: row.examDate, title: row.title, dailyStudyHours: row.dailyStudyHours, notificationTime: row.notificationTime, customization: row.customization });
        }
      });
    });
  }
};

module.exports = UserSettings;
