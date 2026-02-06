import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPurchases, createPurchase, updatePurchase, deletePurchase } from '../slice/purchasesSlice';
import { ethiopianNow } from '../utils/ethiopianDate';
import { fetchBalances, updateBalance } from '../slice/balancesSlice';
import { fetchBalanceReports, createBalanceReport } from '../slice/balanceReportsSlice';
import { fetchCredits, updateCredit } from '../slice/creditsSlice';
import { fetchCreditReports, createCreditReport } from '../slice/creditReportsSlice';

const Purchase = () => {
  const dispatch = useDispatch();
  const { purchases } = useSelector((state) => state.purchases);
  const purchasesList = purchases || [];
  const sortedPurchases = (purchasesList || []).slice().sort((a, b) => new Date(b.date) - new Date(a.date));

  const [createForm, setCreateForm] = useState({ itemsUsed: '', price: '', paymentType: 'Balance', paymentId: '', description: '' });
  const [editForm, setEditForm] = useState({ id: '', itemsUsed: '', price: '', paymentType: 'Balance', paymentId: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchPurchases());
    dispatch(fetchBalances());
    dispatch(fetchBalanceReports());
    dispatch(fetchCredits());
    dispatch(fetchCreditReports());
  }, [dispatch]);

  const { balances } = useSelector((state) => state.balances);
  const { balanceReports } = useSelector((state) => state.balanceReports);
  const { credits } = useSelector((state) => state.credits);
  const { creditReports } = useSelector((state) => state.creditReports);

  const sortedBalanceReports = [...(balanceReports || [])].sort((a, b) => new Date(b.date) - new Date(a.date));
  const currentBalance = sortedBalanceReports.length > 0
    ? sortedBalanceReports[0].remainingBalance
    : (balances || []).reduce((sum, bal) => sum + (bal.amount || 0), 0);

  const sortedCreditReports = [...(creditReports || [])].sort((a, b) => new Date(b.date) - new Date(a.date));
  const currentCredit = sortedCreditReports.length > 0
    ? sortedCreditReports[0].remainingCredit
    : (credits || []).reduce((sum, c) => sum + (c.amount || 0), 0);

  const parseItems = (text) => {
    return (text || '').split(',').map(s => {
      const [item, qty] = s.split(':').map(x => x && x.trim());
      return item ? { item, quantity: parseFloat(qty) || 0 } : null;
    }).filter(Boolean);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const payload = {
      itemsUsed: parseItems(createForm.itemsUsed),
      price: parseFloat(createForm.price) || 0,
      paymentType: createForm.paymentType,
      paymentId: createForm.paymentId,
      description: createForm.description,
      date: new Date().toISOString(),
      ethiopianDate: ethiopianNow().toString()
    };
    try {
      await dispatch(createPurchase(payload)).unwrap();

      const price = payload.price || 0;

      if (payload.paymentType === 'Balance' && balances && balances.length > 0) {
        const itemsDesc = (payload.itemsUsed || []).map(it => `${it.item} x${it.quantity}`).join(', ');
        const reportData = {
          paymentId: payload.paymentId,
          type: 'Used',
          amount: price,
          description: `Purchase: ${itemsDesc}`,
          remainingBalance: currentBalance - price,
          date: payload.date,
          ethiopianDate: payload.ethiopianDate
        };

        await dispatch(createBalanceReport(reportData));
        const main = balances[0];
        await dispatch(updateBalance({ id: main._id, balance: { paymentId: reportData.paymentId, amount: reportData.remainingBalance, description: reportData.description, date: reportData.date } })).unwrap();

        dispatch(fetchBalanceReports());
        dispatch(fetchBalances());
      }

      if (payload.paymentType === 'Credit' && credits && credits.length > 0) {
        const itemsDesc = (payload.itemsUsed || []).map(it => `${it.item} x${it.quantity}`).join(', ');
        const reportData = {
          paymentId: payload.paymentId,
          type: 'Credit Taken',
          amount: price,
          description: `Purchase: ${itemsDesc}`,
          remainingCredit: currentCredit + price,
          date: payload.date,
          ethiopianDate: payload.ethiopianDate
        };

        await dispatch(createCreditReport(reportData));
        const main = credits[0];
        await dispatch(updateCredit({ id: main._id, credit: { paymentId: reportData.paymentId, amount: reportData.remainingCredit, description: reportData.description, date: reportData.date } })).unwrap();

        dispatch(fetchCreditReports());
        dispatch(fetchCredits());
      }

      setCreateForm({ itemsUsed: '', price: '', paymentType: 'Balance', paymentId: '', description: '' });
      dispatch(fetchPurchases());
    } catch (err) {
      console.error('Create purchase error', err);
    }
  };

  const startEdit = (p) => {
    setIsEditing(true);
    setEditForm({ id: p._id, itemsUsed: (p.itemsUsed || []).map(it => `${it.item}:${it.quantity}`).join(', '), price: p.price || '', paymentType: p.paymentType || 'Balance', paymentId: p.paymentId || '', description: p.description || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const payload = {
      itemsUsed: parseItems(editForm.itemsUsed),
      price: parseFloat(editForm.price) || 0,
      paymentType: editForm.paymentType,
      paymentId: editForm.paymentId,
      description: editForm.description,
      date: new Date().toISOString(),
      ethiopianDate: ethiopianNow().toString()
    };
    try {
      await dispatch(updatePurchase({ id: editForm.id, purchase: payload })).unwrap();
      setIsEditing(false);
      setEditForm({ id: '', itemsUsed: '', price: '', paymentType: 'Balance', paymentId: '', description: '' });
      dispatch(fetchPurchases());
    } catch (err) {
      console.error('Update purchase error', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this purchase?')) return;
    try {
      await dispatch(deletePurchase(id)).unwrap();
      dispatch(fetchPurchases());
    } catch (err) {
      console.error('Delete purchase error', err);
    }
  };

  return (
    <div className="page-container">
      <div className="balance-page">
        <div className="balance-header">
          <h1>Purchases</h1>
          <div className="current-balance"><h2>Total Purchases: {purchasesList.length}</h2></div>
        </div>

        <div className="balance-reports">
          <h3>Purchases</h3>
          <div className="reports-table">
            <table>
              <thead>
                <tr>
                  <th>Items Used</th>
                  <th>Price</th>
                  <th>Payment</th>
                  <th>Description</th>
                  <th>Date (Ethiopian)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedPurchases.map(p => (
                  <tr key={p._id}>
                    <td className="items-col">{(p.itemsUsed || []).map(it => `${it.item} x${it.quantity}`).join(', ')}</td>
                    <td>{(p.price || 0).toFixed(2)} Birr</td>
                    <td>{p.paymentType || '—'}</td>
                    <td>{p.description || '—'}</td>
                    <td>{p.ethiopianDate || (p.date ? (typeof p.date === 'string' ? p.date : new Date(p.date).toLocaleString()) : '—')}</td>
                    <td>
                      <button className="btn btn-sm" onClick={() => startEdit(p)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p._id)} style={{marginLeft:8}}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="balance-forms">
          <div className="form-section">
            <h3>{isEditing ? 'Edit Purchase' : 'Create Purchase'}</h3>
            <form onSubmit={isEditing ? handleUpdate : handleCreate} className="balance-form">
              <div className="form-group">
                <label>Items Used (format: name:qty, name2:qty)</label>
                <input type="text" value={isEditing ? editForm.itemsUsed : createForm.itemsUsed} onChange={(e) => isEditing ? setEditForm({...editForm, itemsUsed: e.target.value}) : setCreateForm({...createForm, itemsUsed: e.target.value})} />
              </div>

              <div className="form-group">
                <label>Price:</label>
                <input type="number" step="0.01" value={isEditing ? editForm.price : createForm.price} onChange={(e) => isEditing ? setEditForm({...editForm, price: e.target.value}) : setCreateForm({...createForm, price: e.target.value})} />
              </div>

              <div className="form-group">
                <label>Payment Type:</label>
                <select value={isEditing ? editForm.paymentType : createForm.paymentType} onChange={(e) => isEditing ? setEditForm({...editForm, paymentType: e.target.value}) : setCreateForm({...createForm, paymentType: e.target.value})}>
                  <option value="Balance">Balance</option>
                  <option value="Credit">Credit</option>
                </select>
              </div>

              <div className="form-group">
                <label>Payment ID:</label>
                <input type="text" value={isEditing ? editForm.paymentId : createForm.paymentId} onChange={(e) => isEditing ? setEditForm({...editForm, paymentId: e.target.value}) : setCreateForm({...createForm, paymentId: e.target.value})} />
              </div>

              <div className="form-group">
                <label>Description:</label>
                <input type="text" value={isEditing ? editForm.description : createForm.description} onChange={(e) => isEditing ? setEditForm({...editForm, description: e.target.value}) : setCreateForm({...createForm, description: e.target.value})} />
              </div>

              <div style={{display:'flex', gap:12}}>
                <button type="submit" className="btn btn-primary">{isEditing ? 'Update Purchase' : 'Create Purchase'}</button>
                {isEditing && <button type="button" className="btn" onClick={() => { setIsEditing(false); setEditForm({ id: '', itemsUsed: '', price: '', paymentType: 'Balance', description: '' }); }}>Cancel</button>}
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Purchase;
