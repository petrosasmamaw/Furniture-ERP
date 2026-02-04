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
    </div>
  );
};

export default Dashboard;