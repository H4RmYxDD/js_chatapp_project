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
                fetchConversation();
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
                    {messages.map((msg) => (
                        <Row
                            key={msg.id}
                            className={`mb-3 d-flex ${
                                msg.senderId === currentUserId
                                    ? 'justify-content-end'
                                    : 'justify-content-start'
                            }`}
                        >
                            <Col xs="auto">
                                <div
                                    className={`p-2 rounded ${
                                        msg.senderId === currentUserId
                                            ? 'bg-primary text-white'
                                            : 'bg-light'
                                    }`}
                                    style={{ maxWidth: '300px' }}
                                >
                                    {msg.content}
                                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                                        {new Date(msg.createdAt).toLocaleString()}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    ))}

                    <div ref={chatEndRef}></div>
                </Card.Body>
            </Card>

            {}
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
