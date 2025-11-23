import { Navbar, Nav, Container, Image } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

const TalkBerryNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <Navbar className="berry-navbar text-white" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand 
          onClick={() => navigate('/main')} 
          style={{ cursor: 'pointer' }}
          className="d-flex align-items-center"
        >
          {/* Replace with your actual logo */}
          <div 
            className="rounded-circle bg-white d-flex align-items-center justify-content-center me-2"
            style={{ width: '40px', height: '40px' }}
          >
            <span className="text-primary fw-bold">TB</span>
          </div>
          <span className="fw-bold fs-4">Talk Berry</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              className={`text-white ${isActive('/main') ? 'fw-bold' : ''}`}
              onClick={() => navigate('/main')}
              style={{ cursor: 'pointer' }}
            >
              Home
            </Nav.Link>
            <Nav.Link 
              className={`text-white ${isActive('/users') ? 'fw-bold' : ''}`}
              onClick={() => navigate('/users')}
              style={{ cursor: 'pointer' }}
            >
              Users
            </Nav.Link>
            <Nav.Link 
              className={`text-white ${isActive('/messages') ? 'fw-bold' : ''}`}
              onClick={() => navigate('/messages')}
              style={{ cursor: 'pointer' }}
            >
              Messages
            </Nav.Link>
          </Nav>
          
          <Nav>
            <Nav.Link 
              className="text-white"
              onClick={handleLogout}
              style={{ cursor: 'pointer' }}
            >
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TalkBerryNavbar;