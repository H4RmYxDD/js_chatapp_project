import express from 'express';
import auth from '../util/auth.js';
import * as Message from '../data/messages.js';

const router = express.Router();

router.post('/messages', auth, async (req, res) => {
    const { recipientId, content, parentId } = req.body;

    if (!recipientId || !content) {
        return res.status(400).json({ message: 'recipientId és content kötelező' });
    }

    const newMessage = await Message.createMessage({
        senderId: req.user.id,
        recipientId,
        content,
        parentId: parentId || null,
    });

    res.status(201).json({
        message: 'Message sent successfully',
        messageId: newMessage.id
    });
});

router.get('/messages', auth, async (req, res) => {
    const messages = await Message.getMessagesByUserId(req.user.id);
    res.json(messages);
});

router.get('/messages/conversation/:userId', auth, async (req, res) => {
    const { userId } = req.params;

    const conversation = await Message.getConversation(req.user.id, userId);
    res.json(conversation);
});

router.get('/messages/thread/:id', auth, async (req, res) => {
    const { id } = req.params;

    const thread = await Message.getMessageThread(id);

    if (!thread || thread.length === 0) {
        return res.status(404).json({ message: 'Message thread not found' });
    }

    res.json(thread);
});

export default router;
