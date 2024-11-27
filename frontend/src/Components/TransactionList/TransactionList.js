import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import { UserContext } from '../../Contexts/UserProvider';

function TransactionList() {
    const [transactionList, setTransactionList] = useState([]);
    const { user } = useContext(UserContext);
    const [isLoading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTransactions(page);
    }, [page]);

    const fetchTransactions = async (page) => {
        try {
            let response;
            if (user.role === "admin") {
                response = await axios.get(`http://localhost:8000/api/v1/transactions/getAllTransactions/${page}`, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('token')}` // Ensure token is stored in localStorage
                    }
                });
            } else if (user.role === "user") {
                response = await axios.get(`http://localhost:8000/api/v1/transactions/getMyTransactions/${page}`, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('token')}` // Ensure token is stored in localStorage
                    }
                });
            }
            setTransactionList(response.data.transactions);
            console.log(response.data.transactions);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        }
    }

    return (
        <>
            {/* <!-- Page Controls --> */}
            <div className="mb-4 mt-4">
                <button onClick={() => setPage(prevPage => Math.max(prevPage - 1, 1))} disabled={page === 1} className="btn btn-primary mr-2">
                    Previous
                </button>
                <span>Page {page}</span>
                <button onClick={() => setPage(prevPage => prevPage + 1)} disabled={transactionList.length < 50} className="btn btn-primary ml-2">
                    Next
                </button>
            </div>
            {/* <!-- DataTables --> */}
            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Transactions</h6>
                </div>
                <div className="card-body">
                    {
                        isLoading ? <img src='https://media.giphy.com/media/ZO9b1ntYVJmjZlsWlm/giphy.gif' alt="Loading" />
                            : <div className="table-responsive">
                                <Table striped className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                                    <thead>
                                        <tr>
                                            <th>From</th>
                                            <th>To</th>
                                            <th>Medicine</th>
                                            <th>Quantity</th>
                                            <th>Timestamp</th>
                                        </tr>
                                    </thead>
                                    <tfoot>
                                        <tr>
                                            <th>From</th>
                                            <th>To</th>
                                            <th>Medicine</th>
                                            <th>Quantity</th>
                                            <th>Timestamp</th>
                                        </tr>
                                    </tfoot>
                                    <tbody>
                                        {transactionList.length > 0 && transactionList.map((transaction) => {
                                            return (
                                                <tr key={transaction._id} onClick={() => navigate(`/admin/transactions/view-transaction/${transaction._id}`)}>
                                                    <td>{transaction.fromNode.name}</td>
                                                    <td>{transaction.toNode.name}</td>
                                                    <td>{transaction.medicine.name}</td>
                                                    <td>{transaction.quantity}</td>
                                                    <td>{new Date(transaction.timestamp).toLocaleString()}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            </div>
                    }
                </div>
            </div>
        </>
    )
}

export default TransactionList;
