import db from '../data/data.js';

db.prepare(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT
)`).run();

export const getAllUsers = () => {
    db.prepare('SELECT id, username FROM users').all();
};

export const getUserbyId = (id) => {
    db.prepare('SELECT * FROM users WHERE id = ?').get(id);
};

export const getUserByUsername = (username) => {
    db.prepare('SELECT * FROM users WHERE username = ?').get(username);
};

export const getUserByEmail = (email) => {
    db.prepare('SELECT * FROM users WHERE email = ?').get(email);
};

export const createUser = ({ username, email, hashedPassword }) => {
    db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)').run(
        username,
        email,
        hashedPassword,
    );
};

export const updateUser = (id, { username, email, hashedPassword }) => {
    db.prepare('UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?').run(
        username,
        email,
        hashedPassword,
        id,
    );
};

export const deleteUser = (id) => {
    db.prepare('DELETE FROM users WHERE id = ?').run(id);
};
