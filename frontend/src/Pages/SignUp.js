import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';

const Signup = () => {
    const [err, setErr] = useState("");
    const [message, setMessage] = useState("");
    const [signingUp, setSigningUp] = useState(false);

    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
        passwordConfirm: "",
    });
    // const onchange = (captchaValue) => {
    //     setCaptchaValue(captchaValue)
    // }
    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });

    }
    const register = async (e) => {
        e.preventDefault();
        setMessage("");
        setErr("");
        setSigningUp(true);

        const { username, email, password, passwordConfirm } = user;

        if (username === "" || email === "" || password === "" || passwordConfirm === "") {
            setErr("Please fill all the fields");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/v1/users/signup', {
                username,
                email,
                password,
                passwordConfirm,
            },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            if (response.status === 201) {
                setSigningUp(false);
                setMessage("Registration successful. Please login.");
                window.location.replace("/login");
            }
            // redirect the user to the login page or show a success message.

        } catch (error) {
            // Handle error (e.g., show an error message)
            setSigningUp(false);
            // console.log(error);
            setErr(error.response.data.message); // You can customize this error message.
        }
    }
    const handleChangePassword = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
        if (user.password === value) {
            setErr("");
        }
        else {
            setErr("Passwords do not match");
        }
    }
    return (
        <Container className="login-main">
            <Row className="justify-content-md-center">
                <Col md={{ span: 6 }}>
                    <h2>Create Account</h2>
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col md={{ span: 6 }}>
                    <Form onSubmit={register}>
                        <Form.Group controlId="formBasicFirstName" className='mb-3 signup-form'>
                            <Form.Control name='username' value={user.username} onChange={handleChange} className="customform no-outline" type="name" placeholder="Username" required />
                            <Form.Control name='email' value={user.email} onChange={handleChange} className="customform no-outline" type="email" placeholder="Email" required />
                            <Form.Control name='password' value={user.password} onChange={handleChange} className="customform no-outline" type="password" placeholder="Password" required />
                            <Form.Control name='passwordConfirm' value={user.passwordConfirm} onChange={handleChangePassword} className="customform no-outline" type="password" placeholder="Confirm Password" required />
                            <Button className='custombutton' type="submit">
                                Register
                            </Button>
                            {err !== "" ? (<Alert key='danger' variant='danger'>{err}</Alert>) : null}
                            {message !== "" ? (<Alert key='success' variant='success'>{message}</Alert>) : null}
                        </Form.Group>
                        <div className='text-center' >
                            <p className="mt-2">
                                <a href="/login" className="create-account">Already a user?</a>
                            </p>
                        </div>
                    </Form>
                    {signingUp && <div className="spinner-border text-primary spinner" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>}
                </Col>
            </Row>
        </Container >
    )
}


export default Signup;