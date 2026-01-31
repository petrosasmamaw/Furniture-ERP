import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './pages/navbar';
import Dashboard from './pages/dashboard';
import Item from './pages/item';
import ItemDetail from './pages/itemDetail';
import Balance from './pages/balance';
import BalanceDetail from './pages/balanceDetail';
import Credit from './pages/credit';
import CreditDetail from './pages/creditDetail';
import Machine from './pages/machine';
import MachineDetail from './pages/machineDetail';
import Order from './pages/order';
import OrderDetail from './pages/orderDetail';
import Purchase from './pages/purchase';
import Reserve from './pages/reserve';
import Worker from './pages/worker';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/items" element={<Item />} />
        <Route path="/items/:id" element={<ItemDetail />} />
        <Route path="/balances" element={<Balance />} />
        <Route path="/balances/:id" element={<BalanceDetail />} />
        <Route path="/credits" element={<Credit />} />
        <Route path="/credits/:id" element={<CreditDetail />} />
        <Route path="/machines" element={<Machine />} />
        <Route path="/machines/:id" element={<MachineDetail />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/purchases" element={<Purchase />} />
        <Route path="/reserves" element={<Reserve />} />
        <Route path="/workers" element={<Worker />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;