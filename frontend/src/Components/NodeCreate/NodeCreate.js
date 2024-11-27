import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Importing js-cookie to handle cookies

function NodeCreate() {
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const myFormik = useFormik({
    initialValues: {
      name: "",
      address: "",
      etherAddress: ""
    },
    validate: (values) => {
      let errors = {};

      if (!values.name) {
        errors.name = "Please enter a node name";
      }

      if (!values.address) {
        errors.address = "Please enter an address";
      }

      if (!values.etherAddress) {
        errors.etherAddress = "Please enter an Ethereum address";
      } else if (!/^0x[a-fA-F0-9]{40}$/.test(values.etherAddress)) {
        errors.etherAddress = "Invalid Ethereum address";
      }

      return errors;
    },
    onSubmit: async (values) => {
      setLoading(true);
      try {
        // Setting up the Authorization header
        const token = Cookies.get('token'); // Retrieve the token from cookies
        const headers = {
          Authorization: `Bearer ${token}`
        };

        // Sending a POST request to the server
        await axios.post("http://localhost:8000/api/v1/nodes/addNode", values, { headers });
        navigate("/my-pharmacy/pharmacy-list"); // Navigate to pharmacy list after successful creation
      } catch (error) {
        console.error('Failed to create node:', error);
        alert("Failed to submit node details");
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <div className='container'>
      <h1 className='mt-4 text-dark'>Add New Node</h1>
      <form onSubmit={myFormik.handleSubmit}>
        <div className='row'>
          <div className="col-lg-6">
            <label>Node Name</label>
            <input
              name='name'
              value={myFormik.values.name}
              onChange={myFormik.handleChange}
              type="text"
              className={`customform mt-0 form-control ${myFormik.errors.name ? "is-invalid" : ""}`}
            />
            <div className="invalid-feedback">{myFormik.errors.name}</div>
          </div>

          <div className="col-lg-6">
            <label>Address</label>
            <input
              name='address'
              value={myFormik.values.address}
              onChange={myFormik.handleChange}
              type="text"
              className={`customform mt-0 form-control ${myFormik.errors.address ? "is-invalid" : ""}`}
            />
            <div className="invalid-feedback">{myFormik.errors.address}</div>
          </div>

          <div className="col-lg-6">
            <label>Ethereum Address</label>
            <input
              name='etherAddress'
              value={myFormik.values.etherAddress}
              onChange={myFormik.handleChange}
              type="text"
              className={`customform mt-0 form-control ${myFormik.errors.etherAddress ? "is-invalid" : ""}`}
            />
            <div className="invalid-feedback">{myFormik.errors.etherAddress}</div>
          </div>

          <div className="col-lg-12 mt-3">
            <button type="submit" disabled={isLoading} className="btn btn-primary">
              {isLoading ? "Submitting..." : "Submit Node"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default NodeCreate;
