import { faFaceLaughWink, faTachographDigital, faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Link } from 'react-router-dom'

function Sidebar(props) {
    return (
        <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
            {/* <!-- Nav Item - Users --> */}
            {props.items && props.items.map(item => (
                <li key={item.title} className={`nav-item ${item.active ? "active" : ""}`}>
                    <Link className="nav-link" to={item.path}>
                        <span>{item.title}</span>
                    </Link>
                </li>
            ))}
        </ul>
    )
}

export default Sidebar