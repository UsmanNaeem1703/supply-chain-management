import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function TransactionView() {
    const { transactionId } = useParams();
    const [transaction, setTransaction] = useState(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = Cookies.get('token');
                const response = await axios.get(`http://localhost:8000/api/v1/transactions/getTransaction/${transactionId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setTransaction(response.data);
            } catch (error) {
                console.error('Error fetching transaction data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [transactionId]);

    return (
        <div className="card shadow mb-4 mt-4">
            <div className="card-header py-3">
                <h6 className="mt-3 mb-3 font-weight-bold text-primary">Transaction Details</h6>
            </div>
            <div className="card-body">
                {isLoading ? (
                    <img src='https://media.giphy.com/media/ZO9b1ntYVJmjZlsWlm/giphy.gif' alt="Loading" />
                ) : transaction ? (
                    <Table striped bordered hover className='w-100'>
                        <tbody>
                            <tr>
                                <th>Type</th>
                                <td>{transaction.type}</td>
                            </tr>
                            <tr>
                                <th>Hash</th>
                                <td>{transaction.hash}</td>
                            </tr>
                            <tr>
                                <th>Chain ID</th>
                                <td>{transaction.chainId}</td>
                            </tr>
                            <tr>
                                <th>Nonce</th>
                                <td>{transaction.nonce}</td>
                            </tr>
                            <tr>
                                <th>Block Hash</th>
                                <td>{transaction.blockHash}</td>
                            </tr>
                            <tr>
                                <th>Block Number</th>
                                <td>{transaction.blockNumber}</td>
                            </tr>
                            <tr>
                                <th>Transaction Index</th>
                                <td>{transaction.transactionIndex}</td>
                            </tr>
                            <tr>
                                <th>From</th>
                                <td>{transaction.from}</td>
                            </tr>
                            <tr>
                                <th>To</th>
                                <td>{transaction.to}</td>
                            </tr>
                            <tr>
                                <th>Value</th>
                                <td>{transaction.value}</td>
                            </tr>
                            <tr>
                                <th>Max Priority Fee Per Gas</th>
                                <td>{transaction.maxPriorityFeePerGas}</td>
                            </tr>
                            <tr>
                                <th>Max Fee Per Gas</th>
                                <td>{transaction.maxFeePerGas}</td>
                            </tr>
                            <tr>
                                <th>Gas Price</th>
                                <td>{transaction.gasPrice}</td>
                            </tr>
                            <tr>
                                <th>Gas</th>
                                <td>{transaction.gas}</td>
                            </tr>
                            <tr>
                                <th>Access List</th>
                                <td>{JSON.stringify(transaction.accessList)}</td>
                            </tr>
                            <tr>
                                <th>V</th>
                                <td>{transaction.v}</td>
                            </tr>
                            <tr>
                                <th>R</th>
                                <td>{transaction.r}</td>
                            </tr>
                            <tr>
                                <th>S</th>
                                <td>{transaction.s}</td>
                            </tr>
                        </tbody>
                    </Table>
                ) : (
                    <p>No transaction data available.</p>
                )}
            </div>
        </div>
    );
}

export default TransactionView;
