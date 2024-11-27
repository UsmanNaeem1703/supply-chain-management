import React, { useContext, useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../Contexts/UserProvider';
import axios from 'axios';
import io from 'socket.io-client';

function RequestList(props) {
    const { user } = useContext(UserContext);
    const [requests, setRequests] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const token = Cookies.get('token');
                const response = await axios.get('http://127.0.0.1:8000/api/v1/requests/getRequests', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRequests(response.data.requests);
            } catch (error) {
                console.error('Error fetching requests:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
        // Set up an interval to call the function every 5 seconds
        const intervalId = setInterval(fetchRequests, 5000);

        // Clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [user.id]);

    const handleApprove = async (request) => {
        try {
            const token = Cookies.get('token');
            const payload = {
                requestId: request._id,
                senderId: request.sellerId._id,
                receiverId: request.buyerId._id,
                medicineId: request.productId._id,
                quantity: request.quantity,
            };

            const response = await axios.patch(
                'http://127.0.0.1:8000/api/v1/nodes/updateNodeInventory',
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                alert('Request approved successfully!');
            }
        } catch (error) {
            console.error('Error approving request:', error);
            alert('Failed to approve request');
        }
    };

    const handleDecline = async (requestId) => {
        try {
            const token = Cookies.get('token');
            await axios.delete(
                `http://127.0.0.1:8000/api/v1/requests/deleteRequest/${requestId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Remove the declined request from the state
            setRequests((prevRequests) =>
                prevRequests.filter((request) => request._id !== requestId)
            );

            alert('Request declined and deleted successfully!');
        } catch (error) {
            console.error('Error declining request:', error);
            alert('Failed to decline request');
        }
    };

    return (
        <>
            <div className='mb-4 mt-4'>Hello {user.username},</div>
            <div className='card shadow mb-4'>
                <div className='card-header py-3'>
                    <h6 className='mb-3 font-weight-bold text-primary'>Buyer's Requests</h6>
                </div>
                <div className='card-body'>
                    {isLoading ? (
                        <img
                            src='https://media.giphy.com/media/ZO9b1ntYVJmjZlsWlm/giphy.gif'
                            alt='Loading'
                        />
                    ) : (
                        <div className='table-responsive'>
                            <Table
                                striped
                                className='table table-bordered mb-4'
                                width='100%'
                                cellSpacing='0'
                            >
                                <thead>
                                    <tr>
                                        <th>Sr.</th>
                                        <th>Buyer</th>
                                        <th>Seller</th>
                                        <th>Medicine</th>
                                        <th>Quantity</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map((request, idx) => (
                                        <tr key={request._id}>
                                            <td>{idx + 1}</td>
                                            <td>{request.buyerId.name}</td>
                                            <td>{request.sellerId.name}</td>
                                            <td>{request.productId.name}</td>
                                            <td>{request.quantity}</td>
                                            <td>{request.status}</td>
                                            <td>
                                                {new Date(request.createdAt).toLocaleString()}
                                            </td>
                                            <td>
                                                {request.status === 'Pending' && (
                                                    <>
                                                        <Button
                                                            variant='success'
                                                            size='sm'
                                                            onClick={() => handleApprove(request)}
                                                        >
                                                            Approve
                                                        </Button>{' '}
                                                        <Button
                                                            variant='danger'
                                                            size='sm'
                                                            onClick={() => handleDecline(request._id)}
                                                        >
                                                            Decline
                                                        </Button>
                                                    </>
                                                )}
                                                {request.status !== 'Pending' && <span>N/A</span>}
                                            </td>
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

export default RequestList;
