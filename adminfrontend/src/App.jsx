import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './pages/navbar';
import Footer from './pages/footer';
import Dashboard from './pages/dashboard';
import Item from './pages/item';
import ItemDetail from './pages/itemDetail';
import Balance from './pages/balance';
import Credit from './pages/credit';
import Machine from './pages/machine';
import MachineDetail from './pages/machineDetail';
import Order from './pages/order';
import OrderDetail from './pages/orderDetail';
import Purchase from './pages/purchase';
import Reserve from './pages/reserve';
import PriceCalculator from './pages/priceCalculator';
import Product from './pages/product';
import Login from './pages/login';
import Register from './pages/register';
import ResetPassword from './pages/resetPassword';
import { loadSession } from './slice/authSlice';

const App = () => {
  const dispatch = useDispatch();
  const { session } = useSelector((s) => s.auth);

  useEffect(() => { dispatch(loadSession()); }, [dispatch]);

  return (
    <div className="app-root">
      <Navbar />
      <main className="page-container main-content">
        <Routes>
          {session ? (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/items" element={<Item />} />
          <Route path="/items/:id" element={<ItemDetail />} />
          <Route path="/balances" element={<Balance />} />
          <Route path="/credits" element={<Credit />} />
          <Route path="/machines" element={<Machine />} />
          <Route path="/machines/:id" element={<MachineDetail />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/purchases" element={<Purchase />} />
          <Route path="/price-calculator" element={<PriceCalculator />} />
          <Route path="/reserves" element={<Reserve />} />
              <Route path="/products" element={<Product />} />
              <Route path="/" element={<Dashboard />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/" element={<Login />} />
            </>
          )}
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;