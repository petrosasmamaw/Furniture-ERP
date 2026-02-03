import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMachines, createMachine, updateMachine } from '../slice/machinesSlice';
import { fetchMachineReports, createMachineReport } from '../slice/machineReportsSlice';
import { ethiopianNow } from '../utils/ethiopianDate';

const Machine = () => {
  const dispatch = useDispatch();
  const { machines } = useSelector((state) => state.machines);
  const { machineReports } = useSelector((state) => state.machineReports);

  const [createForm, setCreateForm] = useState({ name: '', serialNumber: '', description: '', price: '', status: 'In Store', worker: '' });
  const [editForm, setEditForm] = useState({ id: '', name: '', serialNumber: '', description: '', price: '', status: 'In Store', worker: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchMachines());
    dispatch(fetchMachineReports());
  }, [dispatch]);

  const sortedReports = [...machineReports].sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleCreate = async (e) => {
    e.preventDefault();
    const price = parseFloat(createForm.price) || 0;
    if (!createForm.name || !createForm.serialNumber) return;

    try {
      const created = await dispatch(createMachine({
        name: createForm.name,
        serialNumber: createForm.serialNumber,
        description: createForm.description,
        price,
        status: createForm.status,
        worker: createForm.worker
      })).unwrap();

      // create machine report for creation
      await dispatch(createMachineReport({
        machine: created._id,
        description: 'Created machine',
        statusChange: created.status,
        worker: created.worker,
        date: ethiopianNow().toString()
      }));

      setCreateForm({ name: '', serialNumber: '', description: '', price: '', status: 'In Store', worker: '' });
      dispatch(fetchMachines());
      dispatch(fetchMachineReports());
    } catch (err) {
      console.error('Create machine error', err);
    }
  };

  const startEdit = (m) => {
    setIsEditing(true);
    setEditForm({ id: m._id, name: m.name, serialNumber: m.serialNumber, description: m.description || '', price: m.price || 0, status: m.status || 'In Store', worker: m.worker || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const price = parseFloat(editForm.price) || 0;
    if (!editForm.name || !editForm.serialNumber) return;

    try {
      const existing = machines.find(x => x._id === editForm.id);
      const prevStatus = existing ? existing.status : editForm.status;

      const updated = await dispatch(updateMachine({ id: editForm.id, machine: { name: editForm.name, serialNumber: editForm.serialNumber, description: editForm.description, price, status: editForm.status, worker: editForm.worker } })).unwrap();

      // create report if status changed
      if (prevStatus !== updated.status) {
        await dispatch(createMachineReport({
          machine: updated._id,
          description: `Status changed: ${prevStatus} -> ${updated.status}`,
          statusChange: updated.status,
          worker: updated.worker,
          date: ethiopianNow().toString()
        }));
      }

      setIsEditing(false);
      setEditForm({ id: '', name: '', serialNumber: '', description: '', price: '', status: 'In Store', worker: '' });
      dispatch(fetchMachines());
      dispatch(fetchMachineReports());
    } catch (err) {
      console.error('Update machine error', err);
    }
  };

  return (
    <div className="page-container">
      <div className="balance-page">
        <div className="balance-header">
          <h1>Machines</h1>
          <div className="current-balance">
            <h2>Total Machines: {machines.length}</h2>
          </div>
        </div>

        <div className="balance-reports">
          <h3>Machines</h3>
          <div className="reports-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Serial</th>
                  <th>Worker</th>
                  <th>Status</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {machines.map(m => (
                  <tr key={m._id}>
                    <td><Link to={`/machines/${m._id}`}>{m.name}</Link></td>
                    <td>{m.serialNumber}</td>
                    <td className="worker-col">{m.worker || '-'}</td>
                    <td><span className={`status-badge status-${m.status.replace(/\s+/g,'-')}`}>{m.status}</span></td>
                    <td>${m.price?.toFixed(2)}</td>
                    <td>{m.description}</td>
                    <td><button className="btn" onClick={() => startEdit(m)}>Edit</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="balance-forms">
          <div className="form-section">
            <h3>{isEditing ? 'Edit Machine' : 'Create Machine'}</h3>
            <form onSubmit={isEditing ? handleUpdate : handleCreate} className="balance-form">
              <div className="form-group">
                <label>Name:</label>
                <input type="text" value={isEditing ? editForm.name : createForm.name} onChange={(e) => isEditing ? setEditForm({...editForm, name: e.target.value}) : setCreateForm({...createForm, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Serial Number:</label>
                <input type="text" value={isEditing ? editForm.serialNumber : createForm.serialNumber} onChange={(e) => isEditing ? setEditForm({...editForm, serialNumber: e.target.value}) : setCreateForm({...createForm, serialNumber: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <input type="text" value={isEditing ? editForm.description : createForm.description} onChange={(e) => isEditing ? setEditForm({...editForm, description: e.target.value}) : setCreateForm({...createForm, description: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Worker:</label>
                <input type="text" value={isEditing ? editForm.worker : createForm.worker} onChange={(e) => isEditing ? setEditForm({...editForm, worker: e.target.value}) : setCreateForm({...createForm, worker: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Price:</label>
                <input type="number" step="0.01" value={isEditing ? editForm.price : createForm.price} onChange={(e) => isEditing ? setEditForm({...editForm, price: e.target.value}) : setCreateForm({...createForm, price: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Status:</label>
                <select value={isEditing ? editForm.status : createForm.status} onChange={(e) => isEditing ? setEditForm({...editForm, status: e.target.value}) : setCreateForm({...createForm, status: e.target.value})}>
                  <option>In Store</option>
                  <option>In Hand of Worker</option>
                  <option>In Maintenance</option>
                </select>
              </div>
              <div style={{display: 'flex', gap: '12px'}}>
                <button type="submit" className="btn btn-primary">{isEditing ? 'Update Machine' : 'Create Machine'}</button>
                {isEditing && <button type="button" className="btn" onClick={() => { setIsEditing(false); setEditForm({ id: '', name: '', serialNumber: '', description: '', price: '', status: 'In Store', worker: '' }); }}>Cancel</button>}
              </div>
            </form>
          </div>

          <div className="form-section">
            <h3>Machine Reports</h3>
            <div className="reports-table">
              <table>
                <thead>
                  <tr>
                      <th>Machine</th>
                      <th>Worker</th>
                      <th>Status</th>
                      <th>Description</th>
                      <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedReports.map(r => (
                    <tr key={r._id}>
                        <td>{r.machine?.name || '—'}</td>
                        <td className="worker-col">{r.worker || '—'}</td>
                        <td>{r.statusChange}</td>
                        <td>{r.description}</td>
                        <td>{typeof r.date === 'string' ? r.date : new Date(r.date).toLocaleString()}</td>
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

export default Machine;
