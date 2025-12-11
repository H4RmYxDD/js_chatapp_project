import db from '../data/data.js';

db.prepare(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)`).run();

export const getAllUsers = () => {
    return db.prepare('SELECT id, username, email FROM users').all();
};

export const getUserbyId = (id) => {
    return db.prepare('SELECT id, username, email, password FROM users WHERE id = ?').get(id);
};

export const getUserByUsername = (username) => {
    return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
};

export const getUserByEmail = (email) => {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
};

export const createUser = ({ username, email, hashedPassword }) => {
    const result = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)')
        .run(username, email, hashedPassword);
    return result.lastInsertRowid;
};

export const updateUser = (id, updates) => {
    const user = getUserbyId(id);
    if (!user) throw new Error('User not found');

    const fields = [];
    const values = [];

    if (updates.username !== undefined) {
        if (updates.username !== user.username) {
            const exists = db.prepare('SELECT 1 FROM users WHERE username = ? AND id != ?').get(updates.username, id);
            if (exists) throw new Error('USERNAME_EXISTS');
        }
        fields.push('username = ?');
        values.push(updates.username);
    }

    if (updates.email !== undefined) {
        if (updates.email !== user.email) {
            const exists = db.prepare('SELECT 1 FROM users WHERE email = ? AND id != ?').get(updates.email, id);
            if (exists) throw new Error('EMAIL_EXISTS');
        }
        fields.push('email = ?');
        values.push(updates.email);
    }

    if (updates.hashedPassword !== undefined) {
        fields.push('password = ?');
        values.push(updates.hashedPassword);
    }

    if (fields.length === 0) return 0;

    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    const info = db.prepare(sql).run(...values);
    return info.changes;
};

export const deleteUser = (id) => {
    return db.prepare('DELETE FROM users WHERE id = ?').run(id).changes;
};