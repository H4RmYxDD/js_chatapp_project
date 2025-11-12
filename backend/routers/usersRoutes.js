import express from 'express';
import * as User from '../data/users.js';
import jws from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import auth from '../util/auth.js';

const router = express.Router();

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
    const newUser = await User.createUser({ username, password: hashedPassword });

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

    const token = jws.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });

    res.json({ message: 'Login successful.', token });
});

router.get('/profile', auth, async (req, res) => {
    const user = await User.getUserbyId(req.user.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ id: user.id, username: user.username, email: user.email });
});

router.patch('/profile', auth, async (req, res) => {
    const { username, email, password } = req.body;
    const updates = {};

    if (username) updates.username = username;
    if (email) updates.email = email;
    if (password) updates.hashedPassword = await bcrypt.hash(password, 10);

    await User.updateUser(req.user.id, updates);

    res.json({ message: 'Profile updated successfully.' });
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
