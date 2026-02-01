import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItems, createItem, updateItem } from '../slice/itemsSlice';
import { Link } from 'react-router-dom';
import { fetchMaterialReports, createMaterialReport } from '../slice/materialReportsSlice';

const Item = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.items);
  const { materialReports } = useSelector((state) => state.materialReports);

  const [createForm, setCreateForm] = useState({ name: '', itemId: '', description: '', quantity: '', price: '' });
  const [editForm, setEditForm] = useState({ id: '', name: '', itemId: '', description: '', quantity: '', price: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchItems());
    dispatch(fetchMaterialReports());
  }, [dispatch]);

  // sort material reports newest first
  const sortedMaterialReports = [...materialReports].sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const qty = parseFloat(createForm.quantity) || 0;
    const price = parseFloat(createForm.price) || 0;
    if (!createForm.name || !createForm.itemId) return;

    try {
      const created = await dispatch(createItem({
        name: createForm.name,
        itemId: createForm.itemId,
        description: createForm.description,
        quantity: qty,
        price
      })).unwrap();

      // create material report recording initial stock
      await dispatch(createMaterialReport({
        item: created._id,
        description: 'Initial stock (create)',
        inQty: qty > 0 ? qty : 0,
        outQty: 0,
        remainingStock: qty,
        date: new Date()
      }));

      setCreateForm({ name: '', itemId: '', description: '', quantity: '', price: '' });
      dispatch(fetchItems());
      dispatch(fetchMaterialReports());
    } catch (err) {
      console.error('Create item error', err);
    }
  };

  const startEdit = (item) => {
    setIsEditing(true);
    setEditForm({ id: item._id, name: item.name, itemId: item.itemId, description: item.description || '', quantity: item.quantity || 0, price: item.price || 0 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const qty = parseFloat(editForm.quantity) || 0;
    const price = parseFloat(editForm.price) || 0;
    if (!editForm.name || !editForm.itemId) return;

    try {
      // find existing item quantity
      const existing = items.find(i => i._id === editForm.id);
      const prevQty = existing ? (existing.quantity || 0) : 0;
      const diff = qty - prevQty;
      const inQty = diff > 0 ? diff : 0;
      const outQty = diff < 0 ? -diff : 0;

      await dispatch(updateItem({ id: editForm.id, item: { name: editForm.name, itemId: editForm.itemId, description: editForm.description, quantity: qty, price } })).unwrap();

      // record material report for this update
      await dispatch(createMaterialReport({
        item: editForm.id,
        description: 'Update item',
        inQty,
        outQty,
        remainingStock: qty,
        date: new Date()
      }));

      setIsEditing(false);
      setEditForm({ id: '', name: '', itemId: '', description: '', quantity: '', price: '' });
      dispatch(fetchItems());
      dispatch(fetchMaterialReports());
    } catch (err) {
      console.error('Update item error', err);
    }
  };

  return (
    <div className="page-container">
      <div className="balance-page">
        <div className="balance-header">
          <h1>Items</h1>
          <div className="current-balance">
            <h2>Total Items: {items.length}</h2>
          </div>
        </div>
        <div className="balance-reports">
          <h3>Items</h3>
          <div className="reports-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Item ID</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item._id}>
                    <td> <Link to={`/items/${item._id}`}>{item.name}</Link> </td>
                    <td>{item.itemId}</td>
                    <td>{item.quantity}</td>
                    <td>${item.price?.toFixed(2)}</td>
                    <td>{item.description}</td>
                    <td>
                      <button className="btn" onClick={() => startEdit(item)}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="balance-forms">
          <div className="form-section">
            <h3>{isEditing ? 'Edit Item' : 'Create Item'}</h3>
            <form onSubmit={isEditing ? handleUpdateSubmit : handleCreateSubmit} className="balance-form">
              <div className="form-group">
                <label>Name:</label>
                <input type="text" value={isEditing ? editForm.name : createForm.name} onChange={(e) => isEditing ? setEditForm({...editForm, name: e.target.value}) : setCreateForm({...createForm, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Item ID:</label>
                <input type="text" value={isEditing ? editForm.itemId : createForm.itemId} onChange={(e) => isEditing ? setEditForm({...editForm, itemId: e.target.value}) : setCreateForm({...createForm, itemId: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <input type="text" value={isEditing ? editForm.description : createForm.description} onChange={(e) => isEditing ? setEditForm({...editForm, description: e.target.value}) : setCreateForm({...createForm, description: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Quantity:</label>
                <input type="number" step="1" value={isEditing ? editForm.quantity : createForm.quantity} onChange={(e) => isEditing ? setEditForm({...editForm, quantity: e.target.value}) : setCreateForm({...createForm, quantity: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Price:</label>
                <input type="number" step="0.01" value={isEditing ? editForm.price : createForm.price} onChange={(e) => isEditing ? setEditForm({...editForm, price: e.target.value}) : setCreateForm({...createForm, price: e.target.value})} required />
              </div>
              <div style={{display: 'flex', gap: '12px'}}>
                <button type="submit" className="btn btn-primary">{isEditing ? 'Update Item' : 'Create Item'}</button>
                {isEditing && <button type="button" className="btn" onClick={() => { setIsEditing(false); setEditForm({ id: '', name: '', itemId: '', description: '', quantity: '', price: '' }); }}>Cancel</button>}
              </div>
            </form>
          </div>

          <div className="form-section">
            <h3>Material Reports</h3>
            <div className="reports-table">
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>In Qty</th>
                    <th>Out Qty</th>
                    <th>Remaining</th>
                    <th>Date</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedMaterialReports.map(r => (
                    <tr key={r._id}>
                      <td>{r.item?.name || '—'}</td>
                      <td>{r.inQty}</td>
                      <td>{r.outQty}</td>
                      <td>{r.remainingStock}</td>
                      <td>{new Date(r.date).toLocaleString()}</td>
                      <td>{r.description}</td>
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

export default Item;
