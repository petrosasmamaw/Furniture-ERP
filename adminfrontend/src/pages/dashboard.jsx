import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { fetchItems } from '../slice/itemsSlice';
import { fetchMachines } from '../slice/machinesSlice';
import { fetchOrders } from '../slice/ordersSlice';
import { fetchPurchases } from '../slice/purchasesSlice';
import { fetchBalances } from '../slice/balancesSlice';
import { fetchCredits } from '../slice/creditsSlice';
import { fetchMaterialReports } from '../slice/materialReportsSlice';
import { fetchReserveItems } from '../slice/reserveItemsSlice';
import { fetchBalanceReports } from '../slice/balanceReportsSlice';
import { fetchCreditReports } from '../slice/creditReportsSlice';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const dispatch = useDispatch();

  const { items } = useSelector((s) => s.items);
  const { machines } = useSelector((s) => s.machines);
  const { orders } = useSelector((s) => s.orders);
  const { purchases } = useSelector((s) => s.purchases);
  const { balances } = useSelector((s) => s.balances);
  const { credits } = useSelector((s) => s.credits);
  const { materialReports } = useSelector((s) => s.materialReports);
  const { reserveItems } = useSelector((s) => s.reserveItems);

  useEffect(() => {
    dispatch(fetchItems());
    dispatch(fetchMachines());
    dispatch(fetchOrders());
    dispatch(fetchPurchases());
    dispatch(fetchBalances());
    dispatch(fetchCredits());
    dispatch(fetchMaterialReports());
    dispatch(fetchReserveItems());
    dispatch(fetchBalanceReports());
    dispatch(fetchCreditReports());
  }, [dispatch]);

  const totalBalance = balances.reduce((sum, b) => sum + (b.amount || 0), 0);
  const totalCredit = credits.reduce((sum, c) => sum + (c.amount || 0), 0);

  const labels = ['Items', 'Machines', 'Orders', 'Purchases', 'Material Reports', 'Reserves'];
  const data = {
    labels,
    datasets: [
      {
        label: 'Counts',
        data: [items.length, machines.length, orders.length, purchases.length, materialReports.length, reserveItems.length],
        backgroundColor: 'rgba(54, 162, 235, 0.6)'
      }
    ]
  };

  // Helper: normalize report date (prefer ethiopianDate if present)
  const normalizeDate = (r) => {
    if (!r) return '';
    if (r.ethiopianDate) return r.ethiopianDate;
    if (r.date) {
      try {
        return new Date(r.date).toLocaleDateString();
      } catch (e) {
        return String(r.date);
      }
    }
    return '';
  };

  // Build balance chart (Added vs Used) over dates
  const balanceByDate = {};
  (window.__STORE__?.getState()?.balanceReports?.balanceReports || []).concat().forEach((r) => {
    const d = normalizeDate(r);
    if (!d) return;
    if (!balanceByDate[d]) balanceByDate[d] = { Added: 0, Used: 0 };
    if (r.type === 'Added') balanceByDate[d].Added += (r.amount || 0);
    if (r.type === 'Used') balanceByDate[d].Used += (r.amount || 0);
  });
  // fallback read from selector if store not available
  if (Object.keys(balanceByDate).length === 0) {
    ( (typeof window !== 'undefined' && window.__STORE__ && window.__STORE__.getState().balanceReports && window.__STORE__.getState().balanceReports.balanceReports) || [] ).forEach((r) => {
      const d = normalizeDate(r);
      if (!d) return;
      if (!balanceByDate[d]) balanceByDate[d] = { Added: 0, Used: 0 };
      if (r.type === 'Added') balanceByDate[d].Added += (r.amount || 0);
      if (r.type === 'Used') balanceByDate[d].Used += (r.amount || 0);
    });
  }

  // If selector has balanceReports, use it (more standard)
  const balanceReports = useSelector((s) => s.balanceReports?.balanceReports || []);
  if (balanceReports.length && Object.keys(balanceByDate).length === 0) {
    balanceReports.forEach((r) => {
      const d = normalizeDate(r);
      if (!d) return;
      if (!balanceByDate[d]) balanceByDate[d] = { Added: 0, Used: 0 };
      if (r.type === 'Added') balanceByDate[d].Added += (r.amount || 0);
      if (r.type === 'Used') balanceByDate[d].Used += (r.amount || 0);
    });
  }

  const balanceDates = Object.keys(balanceByDate).sort((a,b)=> a.localeCompare(b));
  const balanceChartData = {
    labels: balanceDates,
    datasets: [
      { label: 'Added', data: balanceDates.map(d => balanceByDate[d].Added), backgroundColor: 'rgba(16, 185, 129, 0.8)' },
      { label: 'Used', data: balanceDates.map(d => balanceByDate[d].Used), backgroundColor: 'rgba(239, 68, 68, 0.8)' }
    ]
  };

  // Build credit chart (Taken vs Paid)
  const creditByDate = {};
  const creditReports = useSelector((s) => s.creditReports?.creditReports || []);
  creditReports.forEach((r) => {
    const d = normalizeDate(r);
    if (!d) return;
    if (!creditByDate[d]) creditByDate[d] = { 'Credit Taken': 0, 'Credit Paid': 0 };
    if (r.type === 'Credit Taken') creditByDate[d]['Credit Taken'] += (r.amount || 0);
    if (r.type === 'Credit Paid') creditByDate[d]['Credit Paid'] += (r.amount || 0);
  });
  const creditDates = Object.keys(creditByDate).sort((a,b)=> a.localeCompare(b));
  const creditChartData = {
    labels: creditDates,
    datasets: [
      { label: 'Credit Taken', data: creditDates.map(d => creditByDate[d]['Credit Taken']), backgroundColor: 'rgba(59, 130, 246, 0.8)' },
      { label: 'Credit Paid', data: creditDates.map(d => creditByDate[d]['Credit Paid']), backgroundColor: 'rgba(234, 88, 12, 0.8)' }
    ]
  };

  return (
    <div className="page-container">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        <div className="card">
          <h3>Items</h3>
          <p>{items.length}</p>
        </div>
        <div className="card">
          <h3>Machines</h3>
          <p>{machines.length}</p>
        </div>
        <div className="card">
          <h3>Orders</h3>
          <p>{orders.length}</p>
        </div>
        <div className="card">
          <h3>Purchases</h3>
          <p>{purchases.length}</p>
        </div>
        <div className="card">
          <h3>Total Balance</h3>
          <p>${totalBalance.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Total Credit</h3>
          <p>${totalCredit.toFixed(2)}</p>
        </div>
      </div>

      <div style={{ background: '#fff', padding: 16 }}>
        <h3>Overview</h3>
        <Bar data={data} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 20 }}>
        <div className="chart-card">
          <h4 className="chart-title">Balance: Added vs Used</h4>
          <Bar data={balanceChartData} />
        </div>
        <div className="chart-card">
          <h4 className="chart-title">Credit: Taken vs Paid</h4>
          <Bar data={creditChartData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;