import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchOrders, createOrder, updateOrder, deleteOrder } from '../slice/ordersSlice';
import { fetchBalances, createBalance, updateBalance } from '../slice/balancesSlice';
import { fetchBalanceReports, createBalanceReport } from '../slice/balanceReportsSlice';

const Order = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.orders);
  const ordersList = orders || [];

  const [createForm, setCreateForm] = useState({ orderName: '', startDate: '', finishDate: '', paidAmount: '', unpaidAmount: '', planOfWork: '', paymentCode: '', description: '', assignedWorkers: '' });
  const [editForm, setEditForm] = useState({ id: '', orderName: '', startDate: '', finishDate: '', paidAmount: '', unpaidAmount: '', planOfWork: '', paymentCode: '', description: '', assignedWorkers: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchBalances());
    dispatch(fetchBalanceReports());
  }, [dispatch]);

  const { balances } = useSelector((state) => state.balances);
  const { balanceReports } = useSelector((state) => state.balanceReports);

  const sortedBalanceReports = [...(balanceReports || [])].sort((a, b) => new Date(b.date) - new Date(a.date));

  const currentBalance = sortedBalanceReports.length > 0
    ? sortedBalanceReports[0].remainingBalance
    : (balances || []).reduce((sum, bal) => sum + (bal.amount || 0), 0);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!createForm.orderName) return;
    try {
      const payload = {
        orderName: createForm.orderName,
        startDate: createForm.startDate || undefined,
        finishDate: createForm.finishDate || undefined,
        paidAmount: parseFloat(createForm.paidAmount) || 0,
        unpaidAmount: parseFloat(createForm.unpaidAmount) || 0,
        planOfWork: createForm.planOfWork,
        assignedWorkers: createForm.assignedWorkers,
        paymentCode: createForm.paymentCode,
        description: createForm.description
      };
      await dispatch(createOrder(payload)).unwrap();

      const paid = parseFloat(payload.paidAmount) || 0;
      if (paid > 0) {
        const reportData = {
          paymentId: payload.paymentCode,
          type: 'Added',
          amount: paid,
          description: `Paid amount of ${payload.orderName}`,
          remainingBalance: currentBalance + paid,
          date: new Date()
        };

        await dispatch(createBalanceReport(reportData));

        // update central balance if exists, otherwise create one
        if (balances && balances.length > 0) {
          const main = balances[0];
          await dispatch(updateBalance({ id: main._id, balance: { paymentId: reportData.paymentId, amount: reportData.remainingBalance, description: reportData.description, date: reportData.date } })).unwrap();
        } else {
          await dispatch(createBalance({ paymentId: reportData.paymentId, amount: reportData.remainingBalance, description: reportData.description, date: reportData.date })).unwrap();
        }

        dispatch(fetchBalanceReports());
        dispatch(fetchBalances());
      }

      setCreateForm({ orderName: '', startDate: '', finishDate: '', paidAmount: '', unpaidAmount: '', planOfWork: '', paymentCode: '', description: '', assignedWorkers: '' });
      dispatch(fetchOrders());
    } catch (err) {
      console.error('Create order error', err);
    }
  };

  const startEdit = (o) => {
    setIsEditing(true);
    setEditForm({ id: o._id, orderName: o.orderName, startDate: o.startDate ? o.startDate.split('T')[0] : '', finishDate: o.finishDate ? o.finishDate.split('T')[0] : '', paidAmount: o.paidAmount || 0, unpaidAmount: o.unpaidAmount || 0, planOfWork: o.planOfWork || '', paymentCode: o.paymentCode || '', description: o.description || '', assignedWorkers: o.assignedWorkers || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editForm.orderName) return;
    try {
      const payload = {
        orderName: editForm.orderName,
        startDate: editForm.startDate || undefined,
        finishDate: editForm.finishDate || undefined,
        paidAmount: parseFloat(editForm.paidAmount) || 0,
        unpaidAmount: parseFloat(editForm.unpaidAmount) || 0,
        planOfWork: editForm.planOfWork,
        assignedWorkers: editForm.assignedWorkers,
        paymentCode: editForm.paymentCode,
        description: editForm.description
      };
      await dispatch(updateOrder({ id: editForm.id, order: payload })).unwrap();
      setIsEditing(false);
      setEditForm({ id: '', orderName: '', startDate: '', finishDate: '', paidAmount: '', unpaidAmount: '', planOfWork: '', paymentCode: '', description: '' });
      dispatch(fetchOrders());
    } catch (err) {
      console.error('Update order error', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    try {
      await dispatch(deleteOrder(id)).unwrap();
      dispatch(fetchOrders());
    } catch (err) {
      console.error('Delete order error', err);
    }
  };

  return (
    <div className="page-container">
      <div className="balance-page">
        <div className="balance-header">
          <h1>Orders</h1>
          <div className="current-balance"><h2>Total Orders: {ordersList.length}</h2></div>
        </div>

        <div className="balance-reports">
          <h3>Orders</h3>
          <div className="reports-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Start</th>
                  <th>Finish</th>
                  <th>Paid</th>
                  <th>Unpaid</th>
                  <th>Workers</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ordersList.map(o => (
                  <tr key={o._id}>
                    <td><Link to={`/orders/${o._id}`}>{o.orderName}</Link></td>
                    <td>{o.startDate ? new Date(o.startDate).toLocaleDateString() : '—'}</td>
                    <td>{o.finishDate ? new Date(o.finishDate).toLocaleDateString() : '—'}</td>
                    <td>${(o.paidAmount || 0).toFixed(2)}</td>
                    <td>${(o.unpaidAmount || 0).toFixed(2)}</td>
                    <td className="workers-col">{o.assignedWorkers || '—'}</td>
                    <td>
                      <button className="btn" onClick={() => startEdit(o)}>Edit</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(o._id)} style={{marginLeft:8}}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="balance-forms">
          <div className="form-section">
            <h3>{isEditing ? 'Edit Order' : 'Create Order'}</h3>
            <form onSubmit={isEditing ? handleUpdate : handleCreate} className="balance-form">
              <div className="form-group">
                <label>Name:</label>
                <input type="text" value={isEditing ? editForm.orderName : createForm.orderName} onChange={(e) => isEditing ? setEditForm({...editForm, orderName: e.target.value}) : setCreateForm({...createForm, orderName: e.target.value})} required />
              </div>

              <div className="form-group">
                <label>Start Date:</label>
                <input type="date" value={isEditing ? editForm.startDate : createForm.startDate} onChange={(e) => isEditing ? setEditForm({...editForm, startDate: e.target.value}) : setCreateForm({...createForm, startDate: e.target.value})} />
              </div>

              <div className="form-group">
                <label>Finish Date:</label>
                <input type="date" value={isEditing ? editForm.finishDate : createForm.finishDate} onChange={(e) => isEditing ? setEditForm({...editForm, finishDate: e.target.value}) : setCreateForm({...createForm, finishDate: e.target.value})} />
              </div>

              <div className="form-group">
                <label>Paid Amount:</label>
                <input type="number" step="0.01" value={isEditing ? editForm.paidAmount : createForm.paidAmount} onChange={(e) => isEditing ? setEditForm({...editForm, paidAmount: e.target.value}) : setCreateForm({...createForm, paidAmount: e.target.value})} />
              </div>

              <div className="form-group">
                <label>Unpaid Amount:</label>
                <input type="number" step="0.01" value={isEditing ? editForm.unpaidAmount : createForm.unpaidAmount} onChange={(e) => isEditing ? setEditForm({...editForm, unpaidAmount: e.target.value}) : setCreateForm({...createForm, unpaidAmount: e.target.value})} />
              </div>

              <div className="form-group">
                <label>Plan of Work:</label>
                <input type="text" value={isEditing ? editForm.planOfWork : createForm.planOfWork} onChange={(e) => isEditing ? setEditForm({...editForm, planOfWork: e.target.value}) : setCreateForm({...createForm, planOfWork: e.target.value})} />
              </div>

              <div className="form-group">
                <label>Assigned Workers (comma separated):</label>
                <input type="text" value={isEditing ? editForm.assignedWorkers : createForm.assignedWorkers} onChange={(e) => isEditing ? setEditForm({...editForm, assignedWorkers: e.target.value}) : setCreateForm({...createForm, assignedWorkers: e.target.value})} />
              </div>

              <div className="form-group">
                <label>Payment Code:</label>
                <input type="text" value={isEditing ? editForm.paymentCode : createForm.paymentCode} onChange={(e) => isEditing ? setEditForm({...editForm, paymentCode: e.target.value}) : setCreateForm({...createForm, paymentCode: e.target.value})} />
              </div>

              <div className="form-group">
                <label>Description:</label>
                <input type="text" value={isEditing ? editForm.description : createForm.description} onChange={(e) => isEditing ? setEditForm({...editForm, description: e.target.value}) : setCreateForm({...createForm, description: e.target.value})} />
              </div>

              <div style={{display:'flex', gap:12}}>
                <button type="submit" className="btn btn-primary">{isEditing ? 'Update Order' : 'Create Order'}</button>
                {isEditing && <button type="button" className="btn" onClick={() => { setIsEditing(false); setEditForm({ id: '', orderName: '', startDate: '', finishDate: '', paidAmount: '', unpaidAmount: '', planOfWork: '', paymentCode: '', description: '' }); }}>Cancel</button>}
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Order;
