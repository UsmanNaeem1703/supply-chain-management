import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Importing js-cookie to handle cookies

function ProductCreate() {
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const myFormik = useFormik({
    initialValues: {
      batchNumber: "",
      name: "",
      brand: "",
      unitPrice: "",
      retailPrice: ""
    },
    validate: (values) => {
      let errors = {};

      if (!values.batchNumber) {
        errors.batchNumber = "Please enter a batch number";
      }

      if (!values.name) {
        errors.name = "Please enter a product name";
      }

      if (!values.brand) {
        errors.brand = "Please enter a brand";
      }

      if (!values.unitPrice) {
        errors.unitPrice = "Please enter a unit price";
      } else if (isNaN(values.unitPrice)) {
        errors.unitPrice = "Unit price must be a number";
      }

      if (!values.retailPrice) {
        errors.retailPrice = "Please enter a retail price";
      } else if (isNaN(values.retailPrice)) {
        errors.retailPrice = "Retail price must be a number";
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
        await axios.post("http://localhost:8000/api/v1/products/addProduct", values, { headers });
        navigate("/admin/products/product-list"); // Navigate to product list after successful creation
      } catch (error) {
        console.error('Failed to create product:', error);
        alert("Failed to submit product details");
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <div className='container'>
      <h1 className='mt-4 text-dark'>Create New Product</h1>
      <form onSubmit={myFormik.handleSubmit}>
        <div className='row'>
          <div className="col-lg-6">
            <label>Batch Number</label>
            <input
              name='batchNumber'
              value={myFormik.values.batchNumber}
              onChange={myFormik.handleChange}
              type="text"
              className={`customform mt-0 form-control ${myFormik.errors.batchNumber ? "is-invalid" : ""}`}
            />
            <div className="invalid-feedback">{myFormik.errors.batchNumber}</div>
          </div>

          <div className="col-lg-6">
            <label>Name</label>
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
            <label>Brand</label>
            <input
              name='brand'
              value={myFormik.values.brand}
              onChange={myFormik.handleChange}
              type="text"
              className={`customform mt-0 form-control ${myFormik.errors.brand ? "is-invalid" : ""}`}
            />
            <div className="invalid-feedback">{myFormik.errors.brand}</div>
          </div>

          <div className="col-lg-6">
            <label>Unit Price</label>
            <input
              name='unitPrice'
              value={myFormik.values.unitPrice}
              onChange={myFormik.handleChange}
              type="number"
              className={`customform mt-0 form-control ${myFormik.errors.unitPrice ? "is-invalid" : ""}`}
            />
            <div className="invalid-feedback">{myFormik.errors.unitPrice}</div>
          </div>

          <div className="col-lg-6">
            <label>Retail Price</label>
            <input
              name='retailPrice'
              value={myFormik.values.retailPrice}
              onChange={myFormik.handleChange}
              type="number"
              className={`customform mt-0 form-control ${myFormik.errors.retailPrice ? "is-invalid" : ""}`}
            />
            <div className="invalid-feedback">{myFormik.errors.retailPrice}</div>
          </div>

          <div className="col-lg-12 mt-3">
            <button type="submit" disabled={isLoading} className="btn btn-primary">
              {isLoading ? "Submitting..." : "Submit Product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ProductCreate;
