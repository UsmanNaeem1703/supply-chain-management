import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../Contexts/UserProvider';

function NodesList(props) {
  const { user } = useContext(UserContext);
  const [nodes, setNodes] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("token");
        const nodesResponse = await axios.get(`http://localhost:8000/api/v1/nodes/getNodebyOwner/${user.id}`, {
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
  }, [user.id]);

  return (
    <>
      <div className='mb-4 mt-4 d-inline-block'>Hello {user.username}, </div>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="mb-3 font-weight-bold text-primary">User Details</h6>
        </div>
        <div className="card-body">
          {isLoading ? <img src='https://media.giphy.com/media/ZO9b1ntYVJmjZlsWlm/giphy.gif' alt="Loading" />
            : (
              <div className="table-responsive">
                <Table stripted className="table table-bordered mb-4" id="dataTable" width="100%" cellSpacing="0">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user && (
                      <tr>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                <h6 className="mb-3 font-weight-bold text-primary">Associated Nodes</h6>
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
                    {nodes && nodes.map((node, idx) => (
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

export default NodesList;
