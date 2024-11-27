import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Table } from 'react-bootstrap';

function ProductList() {
  const [productList, setProductList] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const fetchProducts = async (page) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/products/getProducts/${page}`);
      setProductList(response.data.products);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  }

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Product List</h1>
        <Link to="/admin/products/create-product" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
          <FontAwesomeIcon icon={faShoppingCart} className="text-white mr-2" />
          Add Product
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
          <h6 className="m-0 font-weight-bold text-primary">Products</h6>
        </div>
        <div className="card-body">
          {
            isLoading ? <img src='https://media.giphy.com/media/ZO9b1ntYVJmjZlsWlm/giphy.gif' alt="Loading" />
              : <div className="table-responsive">
                <Table striped className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                  <thead>
                    <tr>
                      <th>Batch Number</th>
                      <th>Name</th>
                      <th>Brand</th>
                      <th>Unit Price</th>
                      <th>Retail Price</th>
                    </tr>
                  </thead>
                  <tfoot>
                    <tr>
                      <th>Batch Number</th>
                      <th>Name</th>
                      <th>Brand</th>
                      <th>Unit Price</th>
                      <th>Retail Price</th>
                    </tr>
                  </tfoot>
                  <tbody>
                    {productList.length > 0 && productList.map((product) => {
                      return (
                        <tr key={product.batchNumber} onClick={() => navigate(`/admin/products/edit-product/${product._id}`)}>
                          <td>{product.batchNumber}</td>
                          <td>{product.name}</td>
                          <td>{product.brand}</td>
                          <td>Rs. {product.unitPrice.toFixed(2)}</td>
                          <td>Rs. {product.retailPrice.toFixed(2)}</td>
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

export default ProductList;
