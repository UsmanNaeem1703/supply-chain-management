import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import MedicineNetworkGraph from '../Components/MedicineNetworkGraph';
import banner from './Images/home-banner.png';
import 'bootstrap/dist/css/bootstrap.min.css';

function SearchMedicinePage() {
    return (
        <Container fluid className="p-0 m-0">
            {/* Optional: Banner image */}
            <Image src={banner} fluid className="bg-image" />
            <Container className="text-center mt-5" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <Row className="justify-content-center">
                    <Col md={10}>
                        <h1 className="display-4 text-white">Search Medicine</h1>
                        <MedicineNetworkGraph />
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}

export default SearchMedicinePage;
