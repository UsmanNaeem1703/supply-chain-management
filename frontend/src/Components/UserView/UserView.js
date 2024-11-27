import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function UserView(props) {
    const [user, setUser] = useState(props.user);
    const [nodes, setNodes] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setUser(props.user);
                const token = Cookies.get("token");

                const nodesResponse = await axios.get(`http://localhost:8000/api/v1/nodes/getNodebyOwner/${props.user._id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setNodes(nodesResponse.data.nodes);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [props.user._id]);

    return (
        <>
            <div className='mb-4 mt-4 d-inline-block'>User: {props.user.username}</div>
            <h3 className='mb-3 mt-3 d-inline-block float-right' style={{ "cursor": "pointer" }} onClick={() => props.setCurrentUser(null)}>❌</h3>
            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="mb-3 font-weight-bold text-dark">User Details</h6>
                </div>
                <div className="card-body">
                    {isLoading ? <img src='https://media.giphy.com/media/ZO9b1ntYVJmjZlsWlm/giphy.gif' alt="Loading" />
                        : (
                            <div className="table-responsive">
                                <Table stripted className="table table-bordered mb-4" id="dataTable" width="100%" cellSpacing="0">
                                    <thead>
                                        <tr>
                                            <th>_id</th>
                                            <th>Username</th>
                                            <th>Email</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {user && (
                                            <tr>
                                                <td>{user._id}</td>
                                                <td>{user.username}</td>
                                                <td>{user.email}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                                <h6 className="mb-3 font-weight-bold text-dark">Associated Pharmacies</h6>
                                <Table striped className="table table-bordered" width="100%" cellSpacing="0">
                                    <thead>
                                        <tr>
                                            <th>Sr.</th>
                                            <th>Name</th>
                                            <th>Address</th>
                                            <th>Ether Address</th>
                                            <th>Verified</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {nodes.map((node, idx) => (
                                            <tr key={node._id} onClick={() => navigate(`/my-pharmacy/pharmacy-view/${node._id}`)}>
                                                <td>{idx + 1}</td>
                                                <td>{node.name}</td>
                                                <td>{node.address}</td>
                                                <td>{node.etherAddress}</td>
                                                <td>{node.verified ? "✔️" : "❌"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                </div>
            </div>
        </>
    );
}

export default UserView;
