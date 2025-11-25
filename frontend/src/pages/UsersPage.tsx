import { useEffect, useState } from 'react';
import type { User } from '../types/User';
import { apiClient } from '../api/apiClient';
import { toast } from 'react-toastify';
import { Button, Col, Card, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>();
    const navigate = useNavigate();

    const currentUserId = Number(localStorage.getItem('userId'));

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }

        apiClient
            .get('/users')
            .then((res) => setUsers(res.data))
            .catch((error) => {
                if (error.response?.status === 401) {
                    toast.error('Session expired, please log in again');
                    localStorage.removeItem('token');
                    navigate('/');
                } else {
                    toast.error('Failed to fetch users');
                }
            });
    }, [navigate]);

    const handleSendMessage = (userId: number) => {
        navigate(`/messages/send/${userId}`);
    };

    const handleOpenConversation = (userId: number) => {
        navigate(`/messages/conversation/${userId}`);
    };

    const generateCard = (u: User) => {
        if (u.id === currentUserId) return null;

        return (
            <Col key={u.id}>
                <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>{u.username}</Card.Title>
                        <Card.Text>{u.email}</Card.Text>

                        <Button
                            variant="primary"
                            onClick={() => navigate(`/messages/conversation/${u.id}`)}
                            className="w-100"
                        >
                            Chat
                        </Button>
                    </Card.Body>
                </Card>
            </Col>
        );
    };

    return (
        <Container className="mt-4">
            <Row xs={1} md={3} className="g-4">
                {users?.map(generateCard)}
            </Row>
        </Container>
    );
};
export default UsersPage;
