const db = require('../database.js');
const bcrypt = require('bcryptjs');

const User = {
    create: async (name, email, password) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        return new Promise((resolve, reject) => {
            db.run(sql, [name, email, hashedPassword], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, name, email });
                }
            });
        });
    },

    findByEmail: (email) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        return new Promise((resolve, reject) => {
            db.get(sql, [email], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    },

    comparePassword: async (candidatePassword, hash) => {
        return await bcrypt.compare(candidatePassword, hash);
    }
};

module.exports = User;