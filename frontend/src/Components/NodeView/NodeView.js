import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';

function NodeView() {
    const { nodeId } = useParams();
    const [node, setNode] = useState({});
    const [isLoading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = Cookies.get("token");
                const response = await axios.get(`http://localhost:8000/api/v1/nodes/getNode/${nodeId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setNode(response.data);
            } catch (error) {
                console.error('Error fetching node data:', error);
                navigate('/my-pharmacy/pharmacy-list');
            } finally {
                setLoading(false);
            }
        };
        if (nodeId === "") {
            navigate('/my-pharmacy/pharmacy-list');
        }
        fetchData();
    }, [nodeId]);

    return (
        <div className="card shadow mb-4">
            <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Node Details</h6>
            </div>
            <div className="card-body">
                {isLoading ? <img src='https://media.giphy.com/media/ZO9b1ntYVJmjZlsWlm/giphy.gif' alt="Loading" />
                    : (
                        <div className="table-responsive">
                            <Table striped bordered hover>
                                <tbody>
                                    <tr>
                                        <th>ID</th>
                                        <td>{node._id}</td>
                                    </tr>
                                    <tr>
                                        <th>Name</th>
                                        <td>{node.name}</td>
                                    </tr>
                                    <tr>
                                        <th>Address</th>
                                        <td>{node.address}</td>
                                    </tr>
                                    <tr>
                                        <th>Ether Address</th>
                                        <td>{node.etherAddress}</td>
                                    </tr>
                                    <tr>
                                        <th>Balance</th>
                                        <td>{node.etherBalance}</td>
                                    </tr>
                                    <tr>
                                        <th>Verified</th>
                                        <td>{node.verified ? "✔️" : "❌"}</td>
                                    </tr>
                                </tbody>
                            </Table>
                            <h6 className="mb-3 font-weight-bold text-primary">Inventory Details</h6>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Batch Number</th>
                                        <th>Medicine</th>
                                        <th>Brand</th>
                                        <th>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {node.inventory && node.inventory.map(item => (
                                        <tr key={item._id}>
                                            <td>{item.medicine.batchNumber}</td>
                                            <td>{item.medicine.name}</td>
                                            <td>{item.medicine.brand}</td>
                                            <td>{item.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
            </div>
        </div>
    );
}

export default NodeView;
