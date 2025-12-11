import * as User from '../data/users.js';
import jws from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing or malformed.' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jws.verify(token, process.env.JWT_SECRET);
        const user = await User.getUserbyId(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Invalid token: user not found.' });
        }
        req.user = { id: user.id, username: user.username };
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

export default auth;
