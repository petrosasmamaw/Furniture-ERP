import React from 'react';
import { Routes, Route } from 'react-router-dom';
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

const App = () => {
  return (
    <div className="app-root">
      <Navbar />
      <main className="page-container main-content">
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
          <Route path="/price-calculator" element={<PriceCalculator />} />
          <Route path="/reserves" element={<Reserve />} />
          <Route path="/products" element={<Product />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;