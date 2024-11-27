import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { Table } from 'react-bootstrap';
import Cookies from 'js-cookie';
import UserView from '../UserView/UserView';

function UserList() {
  const [userList, setUserList] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const fetchUsers = async (page) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(`http://localhost:8000/api/v1/users/getAllUsers/${page}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setUserList(response.data.users); // Assuming the endpoint returns an array of users under 'users'
      console.log(response.data.users);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  }

  if (currentUser !== null) {
    return (
      <UserView setCurrentUser={setCurrentUser} user={currentUser} />
    )
  }

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-dark">User List</h1>
        <Link to="/admin/users/create-user" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
          <FontAwesomeIcon icon={faUserPlus} className="text-white mr-2" />
          Add User
        </Link>
      </div>
      {/* <!-- Page Controls --> */}
      <div className="mb-4">
        <button onClick={() => setPage(prevPage => Math.max(prevPage - 1, 1))} disabled={page === 1} className="btn btn-primary mr-2">
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage(prevPage => prevPage + 1)} className="btn btn-primary ml-2">
          Next
        </button>
      </div>
      {/* <!-- DataTables --> */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-dark">Users</h6>
        </div>
        <div className="card-body">
          {
            isLoading ? <img src='https://media.giphy.com/media/ZO9b1ntYVJmjZlsWlm/giphy.gif' alt="Loading" />
              : <div className="table-responsive">
                <Table striped bordered hover className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                  <thead>
                    <tr>
                      <th>Sr. </th>
                      <th>Username</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tfoot>
                    <tr>
                      <th>Sr. </th>
                      <th>Username</th>
                      <th>Email</th>
                    </tr>
                  </tfoot>
                  <tbody>
                    {userList.length > 0 && userList.map((user, idx) => {
                      return (
                        <tr key={user._id} onClick={() => { setCurrentUser(user) }}>
                          <td>{idx + 1}</td>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
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

export default UserList;
