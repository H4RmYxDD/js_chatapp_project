import db from '../data/data.js';

db.prepare(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    senderId INTEGER,
    receiverId INTEGER,
    content TEXT,
    parentMsgId INTEGER,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    isRead INTEGER DEFAULT 0
)`).run();

export const getMessagesBetweenUsers = (userId1, userId2) => {
    return db.prepare(`
        SELECT * FROM messages
        WHERE (senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?)
        ORDER BY createdAt DESC
    `).all(userId1, userId2, userId2, userId1);
};

export const getMessageById = (id) => {
    return db.prepare('SELECT * FROM messages WHERE id = ?').get(id);
};

export const createMessage = ({ senderId, recipientId, content, parentMsgId = null }) => {
    const result = db.prepare(`
        INSERT INTO messages (senderId, receiverId, content, parentMsgId)
        VALUES (?, ?, ?, ?)
    `).run(senderId, recipientId, content, parentMsgId);
    return getMessageById(result.lastInsertRowid);
};

export const markMessageAsRead = (id) => {
    db.prepare('UPDATE messages SET isRead = 1 WHERE id = ?').run(id);
};

export const deleteMessage = (id) => {
    db.prepare('DELETE FROM messages WHERE id = ?').run(id);
};

export const getUnreadMessagesForUser = (userId) => {
    return db.prepare('SELECT * FROM messages WHERE receiverId = ? AND isRead = 0').all(userId);
};

export const getAllMessages = () => {
    return db.prepare('SELECT * FROM messages').all();
};

export const updateMessageContent = (id, content) => {
    db.prepare('UPDATE messages SET content = ? WHERE id = ?').run(content, id);
};

export const getMessagesByParentId = (parentMsgId) => {
    return db.prepare('SELECT * FROM messages WHERE parentMsgId = ?').all(parentMsgId);
};

export const getMessagesBySenderId = (senderId) => {
    return db.prepare('SELECT * FROM messages WHERE senderId = ?').all(senderId);
};

export const getMessagesByReceiverId = (receiverId) => {
    return db.prepare('SELECT * FROM messages WHERE receiverId = ?').all(receiverId);
};

export const getRecentMessagesForUser = (userId, limit = 10) => {
    return db.prepare(`
        SELECT * FROM messages
        WHERE senderId = ? OR receiverId = ?
        ORDER BY createdAt DESC
        LIMIT ?
    `).all(userId, userId, limit);
};

export const getMessagesByUserId = (userId) => {
    return db.prepare(`
        SELECT * FROM messages
        WHERE senderId = ? OR receiverId = ?
        ORDER BY createdAt DESC
    `).all(userId, userId);
};

export const getConversation = (userId1, userId2) => {
    return db.prepare(`
        SELECT * FROM messages
        WHERE (senderId = ? AND receiverId = ?)
           OR (senderId = ? AND receiverId = ?)
        ORDER BY createdAt ASC
    `).all(userId1, userId2, userId2, userId1);
};

export const getMessageThread = (id) => {
    return db.prepare(`
        SELECT * FROM messages
        WHERE id = ?
           OR parentMsgId = ?
        ORDER BY createdAt ASC
    `).all(id, id);
};
