// src/App.js
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import SearchMedicinePage from './Pages/SearchMedicinePage';
import './sb-admin-2.min.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './Components/Header';
import { UserProvider } from "./Contexts/UserProvider";
import Signup from './Pages/SignUp';
import Login from './Pages/Login';
import ProductList from './Components/ProductsList/Productslist';
import ProductCreate from './Components/ProductCreate/ProductCreate';
import Portal from './Pages/Portal';
import UserList from './Components/UserList/Userlist';
import ProductEdit from './Components/ProductEdit/ProductEdit';
import TransactionList from './Components/TransactionList/TransactionList';
import TransactionView from './Components/TransactionView/TransactionView';
import NodesList from './Components/NodesList/Nodelist';
import NodeView from './Components/NodeView/NodeView';
import NodeCreate from './Components/NodeCreate/NodeCreate';
import RequestCreate from './Components/RequestCreate/RequestCreate';
import RequestList from './Components/RequestList/RequestList';
import MyRequestList from './Components/MyRequestList/MyRequestList';

function App() {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = (e) => {
    setExpanded(e);
    // console.log(expanded);
  };

  return (
    <BrowserRouter>
      <UserProvider>
        <div className="App">
          <Header expanded={expanded} handleToggle={handleToggle} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchMedicinePage />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path='/admin/products' element={<Portal manage="products" />}>
              <Route path='product-list' element={<ProductList />} />
              <Route path='create-product' element={<ProductCreate />} />
              <Route path='edit-product/:id' element={<ProductEdit />} />
            </Route>
            <Route path='/admin/users' element={<Portal manage="users" />}>
              <Route path='user-list' element={<UserList />} />
            </Route>
            <Route path='/admin/transactions' element={<Portal manage="transactions" />}>
              <Route path='transaction-list' element={<TransactionList />} />
              <Route path='view-transaction/:transactionId' element={<TransactionView />} />
            </Route>
            <Route path='/my-pharmacy' element={<Portal manage="nodes" />}>
              <Route path='pharmacy-list' element={<NodesList />} />
              <Route path='pharmacy-view/:nodeId' element={<NodeView />} />
              <Route path='pharmacy-view' element={<NodeView />} />
              <Route path='pharmacy-create' element={<NodeCreate />} />
            </Route>
            <Route path='/my-transactions' element={<Portal manage="transactions" />}>
              <Route path='transaction-list' element={<TransactionList />} />
              <Route path='view-transaction/:transactionId' element={<TransactionView />} />
            </Route>
            <Route path='/buyer-request' element={<Portal manage="requests" />}>
              <Route path='request-list' element={<RequestList />} />
              <Route path='myRequest-list' element={<MyRequestList />} />
              <Route path='request-create' element={<RequestCreate />} />
            </Route>
          </Routes>
        </div>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
