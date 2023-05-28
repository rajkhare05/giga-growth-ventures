import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export default function NavigationBar({ email }) {
    const BACKEND_URI = process.env.REACT_APP_BACKEND_URI;
    return (
        <div className="dashboard">
            <Navbar bg="primary" variant="dark">
                <Container>
                    <Navbar.Brand href="/">GGV</Navbar.Brand>
                        <Nav className="me-auto">
                        <div className="d-flex justify-content-between">
                            <div className="box1 d-flex">
                                <Nav.Link href="/">Home</Nav.Link>
                                <Nav.Link href={`${BACKEND_URI}/logout`}>Logout</Nav.Link>
                            </div>
                            <div className="box2" style = {{paddingLeft: '200%'}} >
                                <Nav.Link href="#">{ email }</Nav.Link>
                            </div>
                        </div>
                        </Nav>
                </Container>
            </Navbar>           
        </div>
    );
}

