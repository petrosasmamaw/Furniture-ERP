import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOrderById } from '../slice/ordersSlice';
import { fetchOrderReportsByItemId, createOrderReport } from '../slice/orderReportsSlice';
import { ethiopianNow } from '../utils/ethiopianDate'
import { fetchReserveItemsByOrderName } from '../slice/reserveItemsSlice';

const OrderDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { currentOrder, status: orderStatus } = useSelector((state) => state.orders);
  const { orderReports } = useSelector((state) => state.orderReports);
  const { reserveItems } = useSelector((state) => state.reserveItems);
  const navigate = useNavigate();

  const [form, setForm] = useState({ itemsUsed: '', progressPercent: '', description: '' });

  useEffect(() => {
    if (id) dispatch(fetchOrderById(id));
    if (id) dispatch(fetchOrderReportsByItemId(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentOrder && currentOrder.orderName) {
      dispatch(fetchReserveItemsByOrderName(currentOrder.orderName));
    }
  }, [dispatch, currentOrder]);

  if (orderStatus === 'loading' || !currentOrder) return <div className="page-container"><p>Loading order...</p></div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const items = (form.itemsUsed || '').split(',').map(s => {
      const [item, qty] = s.split(':').map(x => x && x.trim());
      return item ? { item, quantity: parseFloat(qty) || 0 } : null;
    }).filter(Boolean);

    const payload = {
      orderName: currentOrder.orderName,
      itemId: id,
      itemsUsed: items,
      progressPercent: parseFloat(form.progressPercent) || 0,
      description: form.description,
      date: new Date().toISOString(),
      ethiopianDate: ethiopianNow().toString()
    };

    try {
      await dispatch(createOrderReport(payload)).unwrap();
      setForm({ itemsUsed: '', progressPercent: '', description: '' });
      dispatch(fetchOrderReportsByItemId(id));
    } catch (err) {
      console.error('Create order report error', err);
    }
  };

  return (
    <div className="page-container">
      <div className="balance-page">
        <div className="balance-header">
          <div>
            <h1>{currentOrder.orderName}</h1>
            <p style={{opacity:0.9}}>Start: {currentOrder.startDate ? new Date(currentOrder.startDate).toLocaleDateString() : '—'}</p>
            <p style={{opacity:0.9}}>Finish: {currentOrder.finishDate ? new Date(currentOrder.finishDate).toLocaleDateString() : '—'}</p>
          </div>
          <div className="current-balance">
            <h2>Progress reports: {(orderReports || []).length}</h2>
            <div style={{marginTop:8}}>
              <button className="btn btn-primary" onClick={() => navigate(`/reserves?orderName=${encodeURIComponent(currentOrder.orderName)}`)}>Create Reserve</button>
            </div>
            <div style={{marginTop:8}}>
              <small>Reserves for this order: {(reserveItems || []).length}</small>
            </div>
          </div>
        </div>

        <div className="balance-forms">
          <div className="form-section">
            <h3>Create Order Report</h3>
            <form className="balance-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Items Used (format: name:qty, name2:qty)</label>
                <input type="text" value={form.itemsUsed} onChange={(e) => setForm({...form, itemsUsed: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Progress Percent</label>
                <input type="number" step="1" value={form.progressPercent} onChange={(e) => setForm({...form, progressPercent: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input type="text" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
              </div>
              <div style={{display:'flex', gap:12}}>
                <button type="submit" className="btn btn-primary">Create Report</button>
              </div>
            </form>
          </div>

          <div className="form-section">
            <h3>Order Reports</h3>
            <div className="reports-table">
              <table>
                <thead>
                  <tr>
                    <th>Items Used</th>
                    <th>Progress</th>
                    <th>Description</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(orderReports || []).map(r => (
                    <tr key={r._id}>
                      <td>{(r.itemsUsed || []).map(it => `${it.item} x${it.quantity}`).join(', ')}</td>
                      <td>{r.progressPercent}%</td>
                      <td>{r.description}</td>
                      <td>{r.ethiopianDate || (typeof r.date === 'string' ? r.date : new Date(r.date).toLocaleString())}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
