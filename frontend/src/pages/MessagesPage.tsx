import { useEffect, useState } from 'react';
import { Container, Card, ListGroup, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/apiClient';

interface Message {
    id: number;
    senderId: number;
    receiverId: number;
    content: string;
    createdAt: string;
    isRead: number;
    senderUsername?: string;
    receiverUsername?: string;
}

const MessagesPage: React.FC = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllMessages();
    }, []);

    const fetchAllMessages = () => {
        apiClient
            .get('/messages')
            .then((res) => {
                setMessages(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const getMessageType = (msg: Message, currentUserId: number) => {
        if (msg.senderId === currentUserId) return 'outgoing';
        if (msg.receiverId === currentUserId) return 'incoming';
        return 'other';
    };

    const currentUserId = Number(localStorage.getItem('userId'));

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>All Messages</h2>
                <Button variant="outline-secondary" onClick={() => navigate('/main')}>
                    Back to Main
                </Button>
            </div>

            {loading ? (
                <p>Loading messages...</p>
            ) : messages.length === 0 ? (
                <Card>
                    <Card.Body className="text-center text-muted">
                        <p>No messages yet</p>
                        <Button variant="primary" onClick={() => navigate('/users')}>
                            Start a Conversation
                        </Button>
                    </Card.Body>
                </Card>
            ) : (
                <Card>
                    <ListGroup variant="flush">
                        {messages.map((msg) => {
                            const type = getMessageType(msg, currentUserId);
                            const isUnread = type === 'incoming' && !msg.isRead;

                            return (
                                <ListGroup.Item
                                    key={msg.id}
                                    action
                                    onClick={() => {
                                        // Navigate to conversation with the other user
                                        const otherUserId =
                                            type === 'outgoing' ? msg.receiverId : msg.senderId;
                                        navigate(`/messages/conversation/${otherUserId}`);
                                    }}
                                >
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div className="flex-grow-1">
                                            <div className="d-flex justify-content-between">
                                                <strong>
                                                    {type === 'outgoing'
                                                        ? `To: User ${msg.receiverId}`
                                                        : `From: User ${msg.senderId}`}
                                                </strong>
                                                <small className="text-muted">
                                                    {formatTime(msg.createdAt)}
                                                </small>
                                            </div>
                                            <div
                                                className="text-truncate"
                                                style={{ maxWidth: '500px' }}
                                            >
                                                {msg.content}
                                            </div>
                                        </div>
                                        {isUnread && (
                                            <Badge bg="primary" pill className="ms-2">
                                                New
                                            </Badge>
                                        )}
                                    </div>
                                </ListGroup.Item>
                            );
                        })}
                    </ListGroup>
                </Card>
            )}
        </Container>
    );
};

export default MessagesPage;
