import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Contexts/UserProvider';

function AdminPanel() {
    const { user, loading } = useContext(UserContext);
    const navigate = useNavigate();

    // Define sidebar items
    const sidebarItems = [
        { title: 'Dashboard', path: '/dashboard', active: true },
        { title: 'Products', path: '/products', active: false },
        { title: 'Users', path: '/users', active: false }
    ];

    useEffect(() => {
        if (loading) return; // Optional: handle loading state if needed
        if (!user || user.role !== 'admin') {
            navigate('/');
        }
    }, [user, loading, navigate]);

    return (
        <div className="admin-panel">
            {/* Other components or additional content can be rendered here */}
            <div>
                {/* Component content goes here */}
            </div>
        </div>
    )
}

export default AdminPanel;
