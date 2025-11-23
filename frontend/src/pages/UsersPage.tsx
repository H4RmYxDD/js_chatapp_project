import { useEffect, useState } from "react";
import type { User } from "../types/User";
import { apiClient } from "../api/apiClient";
import { toast } from "react-toastify";
import { Button, Col, Card, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>()
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        apiClient.get('/users')
          .then((res) => setUsers(res.data))
          .catch((error) => {
              if (error.response?.status === 401) {
                  toast.error('Session expired, please log in again');
                  localStorage.removeItem('token');
                  navigate('/login');
              } else {
                  toast.error('Failed to fetch users');
              }
          });
    }, [navigate]);

    const generateCard = (u: User) => (
      <Col key={u.id}>
        <Card style={{ width: "18rem" }}>
          <Card.Body>
            <Card.Title>{u.username}</Card.Title>
            <Card.Text>{u.email}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
    );

    return (
      <Container>
        <Row xs={"auto"} md={"auto"} className="g-4">
          {users?.map(generateCard)}
        </Row>
      </Container>
    );
};
export default UsersPage;