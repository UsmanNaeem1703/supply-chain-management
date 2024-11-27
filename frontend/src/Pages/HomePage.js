import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Row, Col, Image } from 'react-bootstrap';
import banner from './Images/home-banner.png'
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported in your project

function HomePage() {
    return (
        <Container fluid className="p-0 m-0">
            {/* Background image */}
            <Image src={banner} fluid className="bg-image" />

            <Container className="text-center" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <Row>
                    <Col>
                        <h1 className="display-4 text-white">Pharmacy Supply Chain</h1>
                        <p className="lead text-white">Welcome to the Medicine Tracker App</p>
                        <Button variant="primary" size="lg" className="animated-button">
                            <Link to="/search" className="text-white" style={{ textDecoration: 'none' }}>
                                Search for Medicine
                            </Link>
                        </Button>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}

export default HomePage;
