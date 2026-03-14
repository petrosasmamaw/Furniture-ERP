import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

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

// Using Recharts now; removed Chart.js registration

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
  const totalProfit = totalBalance - totalCredit;

  const labels = ['Items', 'Machines', 'Orders', 'Purchases', 'Material Reports', 'Reserves'];
  const overviewData = labels.map((name, idx) => ({ name, value: [items.length, machines.length, orders.length, purchases.length, materialReports.length, reserveItems.length][idx] || 0 }));

  // Helper: normalize report date (prefer ethiopianDate if present)
  const normalizeDate = (r) => {
    if (!r) return '';
    if (r.ethiopianDate) return r.ethiopianDate;
    if (r.date) {
      try {
        return new Date(r.date).toLocaleDateString();
      } catch {
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
  const balanceChartData = balanceDates.map(d => ({ date: d, Added: balanceByDate[d].Added, Used: balanceByDate[d].Used }));

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
  const creditChartData = creditDates.map(d => ({ date: d, Taken: creditByDate[d]['Credit Taken'], Paid: creditByDate[d]['Credit Paid'] }));

  return (
    <div className="page-container">
      <div className="dashboard-overview" style={{ gap: 12, marginBottom: 20 }}>
        <div className="stat-card card">
          <div className="corner-accent" />
          <h3>Items</h3>
          <p className="value">{items.length}</p>
        </div>
        <div className="stat-card card">
          <div className="corner-accent" />
          <h3>Machines</h3>
          <p className="value">{machines.length}</p>
        </div>
        <div className="stat-card card">
          <div className="corner-accent" />
          <h3>Orders</h3>
          <p className="value">{orders.length}</p>
        </div>
        <div className="stat-card card">
          <div className="corner-accent" />
          <h3>Purchases</h3>
          <p className="value">{purchases.length}</p>
        </div>
        <div className="card amount">
          <div className="corner-accent" />
          <h3>Total Balance</h3>
          <p className="value">${totalBalance.toFixed(2)}</p>
        </div>
        <div className="stat-card card">
          <div className="corner-accent" />
          <h3>Total Credit</h3>
          <p className="value">${totalCredit.toFixed(2)}</p>
        </div>
        <div className="stat-card card">
          <div className="corner-accent" />
          <h3>Profit</h3>
          <p className={totalProfit >= 0 ? 'type-added value' : 'type-used value'}>${totalProfit.toFixed(2)}</p>
        </div>
      </div>

      <div className="chart-card" style={{ marginTop: 12 }}>
        <h3>Overview</h3>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={overviewData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gOverview" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#7c3aed" fillOpacity={1} fill="url(#gOverview)" isAnimationActive={true} animationDuration={900} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 20 }}>
        <div className="chart-card">
          <h4 className="chart-title">Balance: Added vs Used</h4>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={balanceChartData} margin={{ top: 6, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gAdded" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.08}/>
                  </linearGradient>
                  <linearGradient id="gUsed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.08}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="Added" stroke="#10b981" fill="url(#gAdded)" fillOpacity={1} isAnimationActive={true} animationDuration={900} />
                <Area type="monotone" dataKey="Used" stroke="#ef4444" fill="url(#gUsed)" fillOpacity={1} isAnimationActive={true} animationDuration={900} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="chart-card">
          <h4 className="chart-title">Credit: Taken vs Paid</h4>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={creditChartData} margin={{ top: 6, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gTaken" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.08}/>
                  </linearGradient>
                  <linearGradient id="gPaid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.08}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="Taken" stroke="#3b82f6" fill="url(#gTaken)" fillOpacity={1} isAnimationActive={true} animationDuration={900} />
                <Area type="monotone" dataKey="Paid" stroke="#f97316" fill="url(#gPaid)" fillOpacity={1} isAnimationActive={true} animationDuration={900} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;