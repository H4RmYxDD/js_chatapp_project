import express from 'express';
import * as User from '../data/users.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import auth from '../util/auth.js';
import 'dotenv/config';

const router = express.Router();

router.get('/users', auth, async (req, res) => {
    const users = await User.getAllUsers();
    res.json(users);
});

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required.' });
    }

    const existingUser = await User.getUserByUsername(username);
    if (existingUser) {
        return res.status(409).json({ message: 'Username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = User.createUser({ username, email, hashedPassword });

    res.status(201).json({ message: 'User registered successfully.', userId: newUser.id });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const user = await User.getUserByUsername(username);
    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });

    res.json({
        message: 'Login successful.',
        token,
        user: { id: user.id, username: user.username, email: user.email },
    });
});

router.get('/profile', auth, async (req, res) => {
    const user = await User.getUserbyId(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });

    res.json({
        user: { id: user.id, username: user.username, email: user.email },
        token,
    });
});

router.patch('/profile', auth, async (req, res) => {
    const { username, email, password, currentPassword } = req.body;

    const user = await User.getUserbyId(req.user.id);

    if (password) {
        if (!currentPassword) {
            return res
                .status(400)
                .json({ message: 'Current password required to set new password' });
        }
        const valid = await bcrypt.compare(currentPassword, user.password);
        if (!valid) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }
    }

    const updates = {};
    if (username !== undefined) updates.username = username.trim();
    if (email !== undefined) updates.email = email.trim();
    if (password) updates.hashedPassword = await bcrypt.hash(password, 12);

    try {
        await User.updateUser(req.user.id, updates);

        const updatedUser = await User.getUserbyId(req.user.id);

        const token = jwt.sign(
            { id: updatedUser.id, username: updatedUser.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
        );

        res.json({
            message: 'Profile updated successfully',
            user: { id: updatedUser.id, username: updatedUser.username, email: updatedUser.email },
            token,
        });
    } catch (err) {
        if (err.message === 'USERNAME_EXISTS')
            return res.status(409).json({ message: 'Username already taken' });
        if (err.message === 'EMAIL_EXISTS')
            return res.status(409).json({ message: 'Email already in use' });
        res.status(500).json({ message: 'Update failed' });
    }
});

router.delete('/profile', auth, async (req, res) => {
    await User.deleteUser(req.user.id);
    res.json({ message: 'User deleted successfully.' });
});

router.get('/', auth, async (req, res) => {
    const users = await User.getAllUsers();
    res.json(users);
});

router.put('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;
    const updates = {};

    if (username) updates.username = username;
    if (email) updates.email = email;
    if (password) updates.hashedPassword = await bcrypt.hash(password, 10);

    await User.updateUser(id, updates);

    res.json({ message: 'User updated successfully.' });
});

router.get('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const user = await User.getUserbyId(id);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ id: user.id, username: user.username, email: user.email });
});

export default router;
