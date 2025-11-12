import express from 'express';
import * as User from '../data/users.js';
import jws from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import auth from '../util/auth.js';

const router = express.Router();

router.post('/messages', auth, async (req, res) => {
    const { receiverId, content, parentMsgId } = req.body;

    if (!receiverId || !content) {
        return res.status(400).json({ message: 'Receiver ID and content are required.' });
    }

    const newMessage = await Message.createMessage({
        senderId: req.user.id,
        receiverId,
        content,
        parentMsgId,
    });

    res.status(201).json({ message: 'Message sent successfully.', messageId: newMessage.id });
});

router.get('/messages', auth, async (req, res) => {
    const messages = await Message.getMessagesByUserId(req.user.id);
    res.json(messages);
});

router.get('/messages/conversation:userId', auth, async (req, res) => {
    const { userId } = req.params;
    const conversation = await Message.getConversation(req.user.id, userId);
    res.json(conversation);
});

router.get('/messsages/thread/:id', auth, async (req, res) => {
    const { id } = req.params;
    const thread = await Message.getMessageThread(id);
    if (!thread) {
        return res.status(404).json({ message: 'Message thread not found.' });
    }
    res.json(thread);
});
export default router;