const sqlite3 = require('sqlite3').verbose();
const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.');
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username text, 
                email text UNIQUE, 
                password text, 
                CONSTRAINT email_unique UNIQUE (email)
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS courses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                userId INTEGER,
                FOREIGN KEY (userId) REFERENCES users (id)
            )`);

            // Migrations: ensure new course fields exist
            db.run(`ALTER TABLE courses ADD COLUMN weight INTEGER DEFAULT 10`, (err) => {
                if (err && !/duplicate column name/i.test(err.message)) {
                    console.warn('courses.weight migration error:', err.message);
                }
            });
            db.run(`ALTER TABLE courses ADD COLUMN difficulty INTEGER DEFAULT 3`, (err) => {
                if (err && !/duplicate column name/i.test(err.message)) {
                    console.warn('courses.difficulty migration error:', err.message);
                }
            });
            db.run(`ALTER TABLE courses ADD COLUMN color TEXT DEFAULT '#3b82f6'`, (err) => {
                if (err && !/duplicate column name/i.test(err.message)) {
                    console.warn('courses.color migration error:', err.message);
                }
            });

            db.run(`CREATE TABLE IF NOT EXISTS study_plans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                courseId INTEGER,
                title TEXT NOT NULL,
                scheduledDate TEXT NOT NULL,
                completed BOOLEAN DEFAULT 0,
                userId INTEGER,
                FOREIGN KEY (courseId) REFERENCES courses (id),
                FOREIGN KEY (userId) REFERENCES users (id)
            )`);

            // Table for storing per-user app settings / study plan configuration
            db.run(`CREATE TABLE IF NOT EXISTS user_settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER UNIQUE,
                examDate TEXT,
                title TEXT,
                dailyStudyHours REAL,
                notificationTime TEXT,
                customization TEXT,
                FOREIGN KEY (userId) REFERENCES users (id)
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS daily_tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                studyPlanId INTEGER,
                task TEXT NOT NULL,
                completed BOOLEAN DEFAULT 0,
                userId INTEGER,
                FOREIGN KEY (studyPlanId) REFERENCES study_plans (id),
                FOREIGN KEY (userId) REFERENCES users (id)
            )`);

            // Migrations: additional fields for planning and progress
            db.run(`ALTER TABLE daily_tasks ADD COLUMN allocatedMinutes INTEGER DEFAULT 0`, (err) => {
                if (err && !/duplicate column name/i.test(err.message)) {
                    console.warn('daily_tasks.allocatedMinutes migration error:', err.message);
                }
            });
            db.run(`ALTER TABLE daily_tasks ADD COLUMN completedMinutes INTEGER DEFAULT 0`, (err) => {
                if (err && !/duplicate column name/i.test(err.message)) {
                    console.warn('daily_tasks.completedMinutes migration error:', err.message);
                }
            });
            db.run(`ALTER TABLE daily_tasks ADD COLUMN date TEXT`, (err) => {
                if (err && !/duplicate column name/i.test(err.message)) {
                    console.warn('daily_tasks.date migration error:', err.message);
                }
            });
            db.run(`ALTER TABLE daily_tasks ADD COLUMN courseId INTEGER`, (err) => {
                if (err && !/duplicate column name/i.test(err.message)) {
                    console.warn('daily_tasks.courseId migration error:', err.message);
                }
            });

            db.run(`CREATE TABLE IF NOT EXISTS notifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER,
                subscription TEXT NOT NULL,
                FOREIGN KEY (userId) REFERENCES users (id)
            )`);
        });
    }
});

module.exports = db;