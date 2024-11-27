import React, { useEffect } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useState, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { UserContext } from "../Contexts/UserProvider";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const { refreshUserData } = useContext(UserContext);
    const [err, setErr] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const [loggingIn, setLoggingIn] = useState(false);
    const [user, setUser] = useState({
        email: "",
        password: "",
    });
    useEffect(() => {
        if (Cookies.get("token") !== undefined) {
            // console.log('User is logged in');
            navigate('/');
            return;
        }
    }, [])
    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };
    const login = async (e) => {
        e.preventDefault();
        setMessage("");
        setErr("");
        setLoggingIn(true);
        const { email, password } = user;

        if (email === "" || password === "") {
            setErr("Please fill all the fields");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8000/api/v1/users/login",
                {
                    email,
                    password,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response && response.status === 200) {
                setLoggingIn(false);
                setMessage("Login successful.");
                Cookies.set("token", response.data.token, { expires: 7 });
                // localStorage.removeItem('dataLoaded');
                refreshUserData();
                // console.log(response.data.data.role);
                // Cookies.set('role', response.data.data.user.role, { expires: 7 });
                navigate('/subscriptions')
            }
        } catch (error) {
            //console.log(error);
            setLoggingIn(false);
            setErr(error.response.data.message); // You can customize this error message.
        }
    };
    return (
        <div>
            <Container className="login-main">
                <Row className="justify-content-md-center">
                    <Col md={{ span: 6 }}>
                        <h2>Login</h2>
                    </Col>
                </Row>
                <Row className="justify-content-md-center">
                    <Col md={{ span: 6 }}>
                        <Form>
                            <Form.Group controlId="formBasicEmail" className="mb-3">
                                <Form.Control
                                    name="email"
                                    value={user.email}
                                    className="customform no-outline"
                                    onChange={handleChange}
                                    type="email"
                                    placeholder="Email"
                                />
                                <Form.Control
                                    name="password"
                                    value={user.password}
                                    className="customform no-outline"
                                    type="password"
                                    onChange={handleChange}
                                    placeholder="Password"
                                />
                                <div className="text-left mt-2">
                                    <a href="/forgot-password" className="forgot-password">
                                        Forgot your password?
                                    </a>
                                </div>

                                <div className="text-center pt-3">
                                    <Button
                                        className="custombutton mb-3"
                                        type="submit"
                                        onClick={login}
                                    >
                                        Login to Trade Medicines
                                    </Button>
                                    {err !== "" ? (
                                        <Alert key="danger" variant="danger">
                                            {err}
                                        </Alert>
                                    ) : null}
                                    {message !== "" ? (
                                        <Alert key="success" variant="success">
                                            {message}
                                        </Alert>
                                    ) : null}
                                </div>
                            </Form.Group>
                        </Form>
                        {loggingIn && <div className="spinner-border text-primary spinner" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;