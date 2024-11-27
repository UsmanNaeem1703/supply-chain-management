import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function RequestCreate() {
    const [isLoading, setLoading] = useState(false);
    const [buyerNodes, setBuyerNodes] = useState([]);
    const [sellerNodes, setSellerNodes] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [maxQuantity, setMaxQuantity] = useState(0);

    const navigate = useNavigate();

    // Function to extract user ID from JWT token
    function getUserIdFromToken(token) {
        if (!token) return null;
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace('-', '+').replace('_', '/');
            const jwtPayload = JSON.parse(window.atob(base64));
            return jwtPayload.id || jwtPayload.userId || null;
        } catch (error) {
            console.error('Error parsing token:', error);
            return null;
        }
    }

    useEffect(() => {
        const fetchNodes = async () => {
            try {
                setLoading(true);
                const token = Cookies.get('token');
                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                // Extract user ID from token
                const userId = getUserIdFromToken(token);
                if (!userId) {
                    throw new Error('User ID not found in token');
                }

                // Fetch buyer's nodes
                const buyerNodesResponse = await axios.get(
                    `http://localhost:8000/api/v1/nodes/getNodebyOwner/${userId}`,
                    { headers }
                );
                setBuyerNodes(buyerNodesResponse.data.nodes);

                // Fetch all nodes
                const allNodesResponse = await axios.get(
                    'http://127.0.0.1:8000/api/v1/nodes/getNodes',
                    { headers }
                );
                const allNodes = allNodesResponse.data;

                // Filter out buyer's nodes to get seller nodes
                const sellerNodesFiltered = allNodes.filter(
                    (node) => node.owner._id !== userId
                );
                setSellerNodes(sellerNodesFiltered);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching nodes:', error);
                setLoading(false);
            }
        };

        fetchNodes();
    }, []);



    const formik = useFormik({
        initialValues: {
            buyerNode: '',
            sellerNode: '',
            medicine: '',
            quantity: '',
        },
        validate: (values) => {
            const errors = {};
            if (!values.buyerNode) {
                errors.buyerNode = 'Please select a buyer node';
            }
            if (!values.sellerNode) {
                errors.sellerNode = 'Please select a seller node';
            }
            if (!values.medicine) {
                errors.medicine = 'Please select a medicine';
            }
            if (!values.quantity) {
                errors.quantity = 'Please enter a quantity';
            } else if (isNaN(values.quantity) || values.quantity < 1) {
                errors.quantity = 'Quantity must be at least 1';
            } else if (values.quantity > maxQuantity) {
                errors.quantity = `Quantity cannot exceed available stock (${maxQuantity})`;
            }
            return errors;
        },
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const token = Cookies.get('token');
                const headers = {
                    Authorization: `Bearer ${token}`,
                };
                const requestBody = {
                    buyerId: values.buyerNode,
                    sellerId: values.sellerNode,
                    medicine: values.medicine,
                    quantity: values.quantity,
                };
                await axios.post(
                    'http://127.0.0.1:8000/api/v1/requests/addRequest',
                    requestBody,
                    { headers }
                );
                alert('Request created successfully!');
                navigate('/buyer-request/request-list'); // Adjust the path as needed
            } catch (error) {
                console.error('Failed to create request:', error);
                alert('Failed to create request');
            } finally {
                setLoading(false);
            }
        },
    });
    useEffect(() => {
        const fetchMedicines = async () => {
            if (!formik.values.sellerNode) {
                setMedicines([]);
                return;
            }
            try {
                setLoading(true);
                const token = Cookies.get('token');
                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                // Fetch selected seller node's details
                const sellerNodeId = formik.values.sellerNode;
                const sellerNodeResponse = await axios.get(
                    `http://127.0.0.1:8000/api/v1/nodes/getNode/${sellerNodeId}`,
                    { headers }
                );
                const sellerNode = sellerNodeResponse.data;

                // Assuming sellerNode has an 'inventory' field
                setMedicines(sellerNode.inventory);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching seller node inventory:', error);
                setMedicines([]);
                setLoading(false);
            }
        };

        fetchMedicines();
    }, [formik.values.sellerNode]);

    useEffect(() => {
        if (!formik.values.medicine || !medicines.length) {
            setMaxQuantity(0);
            return;
        }
        const selectedMedicine = medicines.find(
            (item) => item.medicine._id === formik.values.medicine
        );
        if (selectedMedicine) {
            setMaxQuantity(selectedMedicine.quantity);
        } else {
            setMaxQuantity(0);
        }
    }, [formik.values.medicine, medicines]);

    return (
        <div className="container">
            <h1 className="mt-4">Create New Request</h1>
            <form onSubmit={formik.handleSubmit}>
                <div className="row">
                    {/* Buyer Node */}
                    <div className="col-lg-6">
                        <label>Buyer Node</label>
                        <select
                            name="buyerNode"
                            value={formik.values.buyerNode}
                            onChange={formik.handleChange}
                            className={`form-control ${formik.errors.buyerNode ? 'is-invalid' : ''
                                }`}
                        >
                            <option value="">Select Buyer Node</option>
                            {buyerNodes.map((node) => (
                                <option key={node._id} value={node._id}>
                                    {node.name}
                                </option>
                            ))}
                        </select>
                        {formik.errors.buyerNode && (
                            <div className="invalid-feedback">{formik.errors.buyerNode}</div>
                        )}
                    </div>
                    {/* Seller Node */}
                    <div className="col-lg-6">
                        <label>Seller Node</label>
                        <select
                            name="sellerNode"
                            value={formik.values.sellerNode}
                            onChange={formik.handleChange}
                            className={`form-control ${formik.errors.sellerNode ? 'is-invalid' : ''
                                }`}
                        >
                            <option value="">Select Seller Node</option>
                            {sellerNodes.map((node) => (
                                <option key={node._id} value={node._id}>
                                    {node.name}
                                </option>
                            ))}
                        </select>
                        {formik.errors.sellerNode && (
                            <div className="invalid-feedback">{formik.errors.sellerNode}</div>
                        )}
                    </div>
                    {/* Medicine */}
                    <div className="col-lg-6">
                        <label>Medicine</label>
                        <select
                            name="medicine"
                            value={formik.values.medicine}
                            onChange={formik.handleChange}
                            className={`form-control ${formik.errors.medicine ? 'is-invalid' : ''
                                }`}
                            disabled={!formik.values.sellerNode}
                        >
                            <option value="">Select Medicine</option>
                            {medicines.map((item) => (
                                <option key={item.medicine._id} value={item.medicine._id}>
                                    {item.medicine.name} (Stock: {item.quantity})
                                </option>
                            ))}
                        </select>
                        {formik.errors.medicine && (
                            <div className="invalid-feedback">{formik.errors.medicine}</div>
                        )}
                    </div>
                    {/* Quantity */}
                    <div className="col-lg-6">
                        <label>Quantity</label>
                        <input
                            name="quantity"
                            value={formik.values.quantity}
                            onChange={formik.handleChange}
                            type="number"
                            min="1"
                            max={maxQuantity}
                            className={`form-control ${formik.errors.quantity ? 'is-invalid' : ''
                                }`}
                            disabled={!formik.values.medicine}
                        />
                        {formik.errors.quantity && (
                            <div className="invalid-feedback">{formik.errors.quantity}</div>
                        )}
                    </div>
                    {/* Submit Button */}
                    <div className="col-lg-12 mt-3">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary"
                        >
                            {isLoading ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default RequestCreate;
