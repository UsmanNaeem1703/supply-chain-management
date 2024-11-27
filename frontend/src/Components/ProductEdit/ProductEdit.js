import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

function ProductEdit() {
    const params = useParams();
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getProductData();
    }, []);

    const getProductData = async () => {
        try {
            const product = await axios.get(`http://localhost:8000/api/v1/products/getProduct/${params.id}`);
            myFormik.setValues(product.data.product);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

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
                errors.brand = "Please enter a brand name";
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
            try {
                setLoading(true);
                const token = Cookies.get('token');
                const headers = {
                    Authorization: `Bearer ${token}`
                };

                await axios.patch(`http://localhost:8000/api/v1/products/updateProduct/${params.id}`, values, { headers });
                navigate("/admin/products/product-list");
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }
    });

    return (
        <>
            <h3 className='mt-3 mb-3 d-inline-block'>ProductEdit - ID: {params.id}</h3>
            <h3 className='mt-3 mb-3 float-right' onClick={() => navigate('/admin/products/product-list')}>❌</h3>
            <div className='container'>
                <form onSubmit={myFormik.handleSubmit}>
                    <div className='row'>
                        <div className="col-lg-6">
                            <label>Batch Number</label>
                            <input name='batchNumber' value={myFormik.values.batchNumber} onChange={myFormik.handleChange} type="text"
                                className={`form-control ${myFormik.errors.batchNumber ? "is-invalid" : ""}`} />
                            <span style={{ color: "red" }}>{myFormik.errors.batchNumber}</span>
                        </div>

                        <div className="col-lg-6">
                            <label>Name</label>
                            <input name='name' value={myFormik.values.name} onChange={myFormik.handleChange} type="text"
                                className={`form-control ${myFormik.errors.name ? "is-invalid" : ""}`} />
                            <span style={{ color: "red" }}>{myFormik.errors.name}</span>
                        </div>

                        <div className="col-lg-6">
                            <label>Brand</label>
                            <input name='brand' value={myFormik.values.brand} onChange={myFormik.handleChange} type="text"
                                className={`form-control ${myFormik.errors.brand ? "is-invalid" : ""}`} />
                            <span style={{ color: "red" }}>{myFormik.errors.brand}</span>
                        </div>

                        <div className="col-lg-6">
                            <label>Unit Price</label>
                            <input name='unitPrice' value={myFormik.values.unitPrice} onChange={myFormik.handleChange} type="number"
                                className={`form-control ${myFormik.errors.unitPrice ? "is-invalid" : ""}`} />
                            <span style={{ color: "red" }}>{myFormik.errors.unitPrice}</span>
                        </div>

                        <div className="col-lg-6">
                            <label>Retail Price</label>
                            <input name='retailPrice' value={myFormik.values.retailPrice} onChange={myFormik.handleChange} type="number"
                                className={`form-control ${myFormik.errors.retailPrice ? "is-invalid" : ""}`} />
                            <span style={{ color: "red" }}>{myFormik.errors.retailPrice}</span>
                        </div>

                        <div className='col-lg-12 mt-3'>
                            <button type="submit" disabled={isLoading} className='btn btn-primary'>
                                {isLoading ? "Updating..." : "Update Product"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default ProductEdit;
