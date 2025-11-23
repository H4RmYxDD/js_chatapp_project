import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/apiClient';
import { Button, Container, Card, Form, Row, Col } from 'react-bootstrap';

interface ThreadMessage {
    id: number;
    senderId: number;
    receiverId: number;
    content: string;
    parentMsgId: number | null;
    createdAt: string;
}

const ThreadPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [thread, setThread] = useState<ThreadMessage[]>([]);
    const [replyContent, setReplyContent] = useState('');

    useEffect(() => {
        apiClient
            .get(`/messages/thread/${id}`)
            .then((res) => setThread(res.data))
            .catch((err) => console.error(err));
    }, [id]);

    const handleReply = () => {
        if (!replyContent.trim()) return;

        const originalMessage = thread[0];
        apiClient
            .post('/messages', {
                recipientId:
                    originalMessage.senderId === Number(localStorage.getItem('userId'))
                        ? originalMessage.receiverId
                        : originalMessage.senderId,
                content: replyContent,
                parentId: id,
            })
            .then(() => {
                setReplyContent('');
                // Refresh thread
                apiClient.get(`/messages/thread/${id}`).then((res) => setThread(res.data));
            });
    };

    return (
        <Container className="mt-4">
            <Button variant="secondary" onClick={() => navigate(-1)} className="mb-3">
                Back
            </Button>

            <h3>Message Thread</h3>

            <Card>
                <Card.Body>
                    {thread.map((msg) => {
                        const showTimestamps = (() => {
                            try {
                                const v = localStorage.getItem('prefs_showTimestamps');
                                return v == null ? true : v === '1';
                            } catch (e) {
                                return true;
                            }
                        })();
                        return (
                            <div
                                key={msg.id}
                                className={`mb-3 p-3 border rounded ${
                                    msg.senderId === Number(localStorage.getItem('userId'))
                                        ? 'bg-primary text-white'
                                        : 'bg-light'
                                }`}
                            >
                                <div>{msg.content}</div>
                                {showTimestamps && (
                                    <small className="text-muted">
                                        {new Date(msg.createdAt).toLocaleString()}
                                    </small>
                                )}
                            </div>
                        );
                    })}
                </Card.Body>
            </Card>

            <Form className="mt-3">
                <Form.Group>
                    <Form.Label>Reply</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Type your reply..."
                    />
                </Form.Group>
                <Button variant="primary" onClick={handleReply} className="mt-2">
                    Send Reply
                </Button>
            </Form>
        </Container>
    );
};

export default ThreadPage;
