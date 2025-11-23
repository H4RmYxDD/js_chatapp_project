import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/apiClient';
import { Button, Container, Row, Col, Form, Card } from 'react-bootstrap';

interface Message {
    id: number;
    senderId: number;
    receiverId: number;
    content: string;
    createdAt: string;
}

const ConversationPage: React.FC = () => {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [messages, setMessages] = useState<Message[]>([]);
    const [messageText, setMessageText] = useState('');

    const currentUserId = Number(localStorage.getItem('userId'));
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    const fetchConversation = () => {
        apiClient
            .get(`/messages/conversation/${userId}`)
            .then((res) => setMessages(res.data))
            .catch((err) => {
                console.error(err);
                navigate('/users');
            });
    };

    const handleSend = () => {
        if (!messageText.trim()) return;

        apiClient
            .post('/messages', {
                recipientId: Number(userId),
                content: messageText,
                parentId: null,
            })
            .then(() => {
                setMessageText('');
                fetchConversation(); // frissítés
            })
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        fetchConversation();
        const interval = setInterval(fetchConversation, 5000);
        return () => clearInterval(interval);
    }, [userId]);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <Container className="mt-4">
            <h3>Conversation</h3>
            <hr />

            <Card style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <Card.Body>
                    // Replace the message display with:
                    {messages.map((msg) => (
                        <Row
                            key={msg.id}
                            className={`mb-3 ${
                                msg.senderId === currentUserId
                                    ? 'justify-content-end'
                                    : 'justify-content-start'
                            }`}
                        >
                            <Col xs="auto" style={{ maxWidth: '70%' }}>
                                <div
                                    className={`p-3 rounded-3 ${
                                        msg.senderId === currentUserId
                                            ? 'berry-chat-bubble-sent'
                                            : 'berry-chat-bubble-received'
                                    }`}
                                >
                                    <div className="mb-1">{msg.content}</div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <small
                                            className={
                                                msg.senderId === currentUserId
                                                    ? 'text-white-50'
                                                    : 'text-muted'
                                            }
                                        >
                                            {formatTime(msg.createdAt)}
                                        </small>
                                        <Button
                                            variant={
                                                msg.senderId === currentUserId
                                                    ? 'outline-light'
                                                    : 'outline-primary'
                                            }
                                            size="sm"
                                            onClick={() => navigate(`/messages/thread/${msg.id}`)}
                                            className="ms-2 border-0"
                                        >
                                            💬
                                        </Button>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    ))}
                    <div ref={chatEndRef}></div>
                </Card.Body>
            </Card>

            {/* Üzenet küldés */}
            <Row className="mt-3">
                <Col xs={10}>
                    <Form.Control
                        type="text"
                        placeholder="Type a message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                </Col>
                <Col xs={2}>
                    <Button variant="primary" className="w-100" onClick={handleSend}>
                        Send
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default ConversationPage;
