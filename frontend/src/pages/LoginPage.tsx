import { useState } from 'react';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../api/apiClient';
import { toast } from 'react-toastify';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await apiClient.post('/login', { username, password });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('userId', user.id.toString());

            toast.success('Welcome to Talk Berry! 🍓');
            navigate('/main');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <Container fluid className="login-wrapper d-flex align-items-center justify-content-center min-vh-100 berry-gradient">
            <Row className="w-100 justify-content-center mx-0">
                <Col xs={12} sm={10} md={8} lg={6} xl={4}>
                    <Card className="berry-card p-4 p-md-5">
                        <div className="text-center mb-4">
                            <div
                                className="berry-gradient rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                style={{ width: '80px', height: '80px' }}
                            >
                                <span className="text-white fw-bold fs-3">TB</span>
                            </div>
                            <h2 className="fw-bold berry-text-primary">Talk Berry</h2>
                            <p className="text-muted">Sweet conversations await</p>
                        </div>

                        <Form onSubmit={handleLogin}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="py-3"
                                    size="lg"
                                />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label className="fw-semibold">Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="py-3"
                                    size="lg"
                                />
                            </Form.Group>
                            <Button
                                type="submit"
                                className="w-100 btn-berry-primary py-3 fw-semibold"
                                size="lg"
                            >
                                Sign In
                            </Button>
                        </Form>

                        <div className="text-center mt-4">
                            <span className="text-muted">New here? </span>
                            <Link
                                to="/register"
                                className="text-decoration-none fw-semibold berry-text-primary"
                            >
                                Create an account
                            </Link>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginPage;
