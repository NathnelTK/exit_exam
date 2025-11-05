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

            db.run(`CREATE TABLE IF NOT EXISTS daily_tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                studyPlanId INTEGER,
                task TEXT NOT NULL,
                completed BOOLEAN DEFAULT 0,
                userId INTEGER,
                FOREIGN KEY (studyPlanId) REFERENCES study_plans (id),
                FOREIGN KEY (userId) REFERENCES users (id)
            )`);

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