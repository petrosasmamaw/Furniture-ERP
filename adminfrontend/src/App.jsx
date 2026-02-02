import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './pages/navbar';
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

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
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
        <Route path="/reserves" element={<Reserve />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </>
  );
};

export default App;