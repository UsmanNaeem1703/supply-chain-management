import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../Components/Sidebar/Sidebar';

function Portal(props) {
    const { manage } = props;

    // Define the sidebar links based on the `manage` prop
    let sidebarItems = [];
    if (manage === 'products') {
        sidebarItems = [
            { title: 'Product List', path: '/admin/products/product-list', active: window.location.pathname.includes('/product-list') },
            { title: 'Create Product', path: '/admin/products/create-product', active: window.location.pathname.includes('/create-product') }
        ];
    } else if (manage === 'users') {
        sidebarItems = [
            { title: 'User List', path: '/admin/users/user-list', active: window.location.pathname.includes('/user-list') }
        ];
    } else if (manage === 'nodes') {
        sidebarItems = [
            { title: 'Pharmacy List', path: '/my-pharmacy/pharmacy-list', active: window.location.pathname.includes('/pharmacy-list') },
            { title: 'Pharmacy View', path: '/my-pharmacy/pharmacy-view', active: window.location.pathname.includes('/pharmacy-view') },
            { title: 'Pharmacy Add', path: '/my-pharmacy/pharmacy-create', active: window.location.pathname.includes('/pharmacy-create') }
        ];
    } else if (manage === 'requests') {
        sidebarItems = [
            { title: 'Buyer\'s Request', path: '/buyer-request/request-list', active: window.location.pathname.includes('/request-list') },
            { title: 'My Requests', path: '/buyer-request/myRequest-list', active: window.location.pathname.includes('/myRequest-list') },
            { title: 'Request Add', path: '/buyer-request/request-create', active: window.location.pathname.includes('/request-create') }
        ];
    }

    return (
        <>
            <div id="wrapper">
                {sidebarItems.length && <Sidebar items={sidebarItems} />}  {/* Pass the items to Sidebar */}
                <div id="content-wrapper" className="d-flex flex-column" style={{ "minHeight": "100vh" }}>
                    <div id="content">
                        <div className='container-fluid'>
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Portal;
