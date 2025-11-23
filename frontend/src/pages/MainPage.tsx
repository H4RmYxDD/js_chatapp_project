import { useEffect, useState } from 'react';
import { Container, Button, Row, Col, Card, ListGroup, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/apiClient';

interface Conversation {
    userId: number;
    username: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
}

const MainPage: React.FC = () => {
    const navigate = useNavigate();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }
        fetchRecentConversations();
    }, [navigate]);

    const fetchRecentConversations = () => {
        setLoading(true);
        // First, get all users to map IDs to usernames
        apiClient
            .get('/users')
            .then((usersRes) => {
                const users = usersRes.data;
                const currentUserId = Number(localStorage.getItem('userId'));

                // Get all messages for current user
                return apiClient.get('/messages').then((messagesRes) => {
                    const messages = messagesRes.data;

                    // Group messages by conversation partner
                    const conversationMap = new Map();

                    messages.forEach((msg: any) => {
                        const partnerId =
                            msg.senderId === currentUserId ? msg.receiverId : msg.senderId;
                        const partner = users.find((u: any) => u.id === partnerId);

                        if (partner && partner.id !== currentUserId) {
                            if (!conversationMap.has(partnerId)) {
                                conversationMap.set(partnerId, {
                                    userId: partnerId,
                                    username: partner.username,
                                    messages: [],
                                    unreadCount: 0,
                                });
                            }

                            const conv = conversationMap.get(partnerId);
                            conv.messages.push(msg);

                            // Count unread messages
                            if (msg.receiverId === currentUserId && !msg.isRead) {
                                conv.unreadCount++;
                            }
                        }
                    });

                    // Convert to array and sort by most recent message
                    const conversationsArray = Array.from(conversationMap.values())
                        .map((conv) => {
                            const lastMessage = conv.messages.sort(
                                (a: any, b: any) =>
                                    new Date(b.createdAt).getTime() -
                                    new Date(a.createdAt).getTime(),
                            )[0];

                            return {
                                userId: conv.userId,
                                username: conv.username,
                                lastMessage: lastMessage?.content || 'No messages yet',
                                lastMessageTime: lastMessage?.createdAt || new Date().toISOString(),
                                unreadCount: conv.unreadCount,
                            };
                        })
                        .sort(
                            (a, b) =>
                                new Date(b.lastMessageTime).getTime() -
                                new Date(a.lastMessageTime).getTime(),
                        );

                    setConversations(conversationsArray);
                    setLoading(false);
                });
            })
            .catch((error) => {
                console.error('Error fetching conversations:', error);
                setLoading(false);
            });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/');
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={10}>
                    <Card>
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h2>Welcome to Chat App</h2>
                                <Button variant="outline-secondary" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </div>

                            <Row>
                                <Col md={8}>
                                    <h4>Recent Conversations</h4>
                                    {loading ? (
                                        <p>Loading conversations...</p>
                                    ) : conversations.length === 0 ? (
                                        <Card>
                                            <Card.Body className="text-center text-muted">
                                                <p>No conversations yet</p>
                                                <Button
                                                    variant="primary"
                                                    onClick={() => navigate('/users')}
                                                >
                                                    Start a Conversation
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    ) : (
                                        <ListGroup>
                                            {conversations.map((conv) => (
                                                <ListGroup.Item
                                                    key={conv.userId}
                                                    action
                                                    onClick={() =>
                                                        navigate(
                                                            `/messages/conversation/${conv.userId}`,
                                                        )
                                                    }
                                                    className="d-flex justify-content-between align-items-center"
                                                >
                                                    <div className="flex-grow-1">
                                                        <div className="d-flex justify-content-between">
                                                            <strong>{conv.username}</strong>
                                                            <small className="text-muted">
                                                                {formatTime(conv.lastMessageTime)}
                                                            </small>
                                                        </div>
                                                        <div
                                                            className="text-truncate"
                                                            style={{ maxWidth: '400px' }}
                                                        >
                                                            {conv.lastMessage}
                                                        </div>
                                                    </div>
                                                    {conv.unreadCount > 0 && (
                                                        <Badge bg="primary" pill className="ms-2">
                                                            {conv.unreadCount}
                                                        </Badge>
                                                    )}
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    )}
                                </Col>

                                <Col md={4}>
                                    <h5>Quick Actions</h5>
                                    <div className="d-grid gap-2">
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            onClick={() => navigate('/users')}
                                        >
                                            View All Users
                                        </Button>
                                        <Button
                                            variant="outline-primary"
                                            onClick={() => navigate('/messages')}
                                        >
                                            All Messages
                                        </Button>
                                    </div>

                                    <Card className="mt-3">
                                        <Card.Body>
                                            <Card.Title>Stats</Card.Title>
                                            <Card.Text>
                                                Active conversations:{' '}
                                                <strong>{conversations.length}</strong>
                                            </Card.Text>
                                            <Card.Text>
                                                Unread messages:{' '}
                                                <strong>
                                                    {conversations.reduce(
                                                        (total, conv) => total + conv.unreadCount,
                                                        0,
                                                    )}
                                                </strong>
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default MainPage;
