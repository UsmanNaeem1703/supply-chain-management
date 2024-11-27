import React, { useState, useContext } from "react";
import { UserContext } from "../Contexts/UserProvider";
import { Container, Navbar, Nav } from "react-bootstrap";
import Cookies from "js-cookie";

const Header = (props) => {
    const { user } = useContext(UserContext);
    const [setExpanded] = useState(props.expanded);

    const logout = () => {
        Cookies.remove("token");
        localStorage.removeItem("dataLoaded");
        localStorage.removeItem("user");
        window.location.href = "/login";
    };
    return (
        <div>
            <Navbar expanded={props.expanded} className="main-header" onToggle={setExpanded}>
                <Container>
                    <Navbar.Brand href="/">
                        <h1>PharmaChain</h1>
                    </Navbar.Brand>

                    <Navbar.Collapse id="basic-navbar-nav" className="menu-right">
                        <Nav className="ml-auto">
                            {(user && user.role === "admin") && (
                                <React.Fragment>
                                    <Nav.Link href="/admin/users/user-list">Manage Nodes</Nav.Link>
                                    <Nav.Link href="/admin/transactions/transaction-list">Transactions</Nav.Link>
                                    <Nav.Link href="/admin/products/product-list">Manage Medicines</Nav.Link>
                                    <Nav.Link href="/buyer-request/request-list">Sell Medicines</Nav.Link>
                                </React.Fragment>
                            )}
                            {(user && user.role === "user") ? (
                                <React.Fragment>
                                    <Nav.Link href="/buyer-request/myRequest-list">Buy Medicines</Nav.Link>
                                    <Nav.Link href="/buyer-request/request-list">Sell Medicines</Nav.Link>
                                    <Nav.Link href="/my-pharmacy/pharmacy-list">My Pharmacy(s)</Nav.Link>
                                    <Nav.Link href="/my-transactions/transaction-list">Transactions</Nav.Link>
                                </React.Fragment>
                            ) : (
                                <span>
                                    <Nav.Link href="/search">Search Medicine</Nav.Link>
                                </span>
                            )}
                            {!user ? (
                                <>
                                    <Nav.Link href="/login">Login</Nav.Link>
                                    <Nav.Link href="/register">Register</Nav.Link>
                                </>
                            ) : (
                                <Nav.Link href="/" onClick={logout}>Logout</Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
};

export default Header;