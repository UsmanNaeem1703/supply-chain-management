// src/components/MedicineNetworkGraph.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FormControl, InputGroup, ListGroup, Spinner, Alert } from 'react-bootstrap';
import Graph from './Graph';

function MedicineNetworkGraph() {
    const [medicineName, setMedicineName] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch medicine suggestions based on user input
    useEffect(() => {
        if (medicineName.length > 1) {
            axios.get(`http://localhost:8000/api/v1/products/name/${medicineName}`)
                .then(response => {
                    setSuggestions(response.data);
                    setError('');
                })
                .catch(err => {
                    console.error(err);
                    setError('Error fetching medicine suggestions.');
                });
        } else {
            setSuggestions([]);
        }
    }, [medicineName]);

    // Fetch transactions when a medicine is selected
    useEffect(() => {
        if (selectedMedicine) {
            setLoading(true);
            axios.get(`http://localhost:8000/api/v1/transactions/medicine/${selectedMedicine._id}`)
                .then(response => {
                    setTransactions(response.data);
                    setError('');
                })
                .catch(err => {
                    console.error(err);
                    setError('Error fetching transactions.');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [selectedMedicine]);

    const handleMedicineChange = e => {
        setMedicineName(e.target.value);
        setSelectedMedicine(null);
        setTransactions([]);
    };

    const handleSuggestionClick = medicine => {
        setMedicineName(medicine.name);
        setSelectedMedicine(medicine);
        setSuggestions([]);
    };

    return (
        <div className="container mt-4">
            <h3>Search Medicine</h3>
            <InputGroup>
                <FormControl
                    type="text"
                    value={medicineName}
                    onChange={handleMedicineChange}
                    placeholder="Enter medicine name"
                />
            </InputGroup>
            {suggestions.length > 0 && (
                <ListGroup className="position-absolute" style={{ zIndex: 1000 }}>
                    {suggestions.map(medicine => (
                        <ListGroup.Item key={medicine._id} action onClick={() => handleSuggestionClick(medicine)}>
                            {medicine.name}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            {loading && <Spinner animation="border" variant="primary" className="mt-3" />}
            {transactions.length > 0 && !loading && (
                <div className="mt-4">
                    <Graph transactions={transactions} medicineName={selectedMedicine.name} />
                </div>
            )}
        </div>
    );
}

export default MedicineNetworkGraph;
