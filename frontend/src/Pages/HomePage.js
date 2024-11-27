// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div>
            <h1>Home Page</h1>
            <p style={{ "color": "white" }}>Welcome to the Medicine Tracker App</p>
            <Link to="/search">Search for Medicine</Link>
        </div>
    );
}

export default HomePage;
