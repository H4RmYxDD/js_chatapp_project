import db from '../data/data.js';

db.prepare(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT
)`).run();

export const getAllUsers = () => {
    return db.prepare('SELECT id, username FROM users').all();
};

export const getUserbyId = (id) => {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
};

export const getUserByUsername = (username) => {
    return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
};

export const getUserByEmail = (email) => {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
};

export const createUser = ({ username, email, hashedPassword }) => {
    const conflict = db.prepare('SELECT id, username, email FROM users WHERE username = ? OR email = ?').get(username, email);
    if (conflict) {
        if (conflict.username === username) {
            const err = new Error('USERNAME_EXISTS');
            err.code = 'USERNAME_EXISTS';
            throw err;
        }
        if (conflict.email === email) {
            const err = new Error('EMAIL_EXISTS');
            err.code = 'EMAIL_EXISTS';
            throw err;
        }
        const err = new Error('USER_CONFLICT');
        err.code = 'USER_CONFLICT';
        throw err;
    }

    const info = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)').run(
        username,
        email,
        hashedPassword,
    );

    return info.lastInsertRowid;
};

export const updateUser = (id, { username, email, hashedPassword }) => {
    const conflict = db.prepare('SELECT id, username, email FROM users WHERE (username = ? OR email = ?) AND id != ?').get(username, email, id);
    if (conflict) {
        if (conflict.username === username) {
            const err = new Error('USERNAME_EXISTS');
            err.code = 'USERNAME_EXISTS';
            throw err;
        }
        if (conflict.email === email) {
            const err = new Error('EMAIL_EXISTS');
            err.code = 'EMAIL_EXISTS';
            throw err;
        }
    }

    const info = db.prepare('UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?').run(
        username,
        email,
        hashedPassword,
        id,
    );

    return info.changes;
};

export const deleteUser = (id) => {
    return db.prepare('DELETE FROM users WHERE id = ?').run(id);
};
