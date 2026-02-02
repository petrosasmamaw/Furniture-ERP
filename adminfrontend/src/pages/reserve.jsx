import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchReserveItems,
  createReserveItem,
  updateReserveItem,
  deleteReserveItem,
} from '../slice/reserveItemsSlice'

const Reserve = () => {
  const dispatch = useDispatch()
  const { reserveItems, status } = useSelector((state) => state.reserveItems)

  const [form, setForm] = useState({ itemId: '', item: '', amount: '', description: '' })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    if (status === 'idle') dispatch(fetchReserveItems())
  }, [dispatch, status])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const resetForm = () => {
    setForm({ itemId: '', item: '', amount: '', description: '' })
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...form, amount: Number(form.amount) }
    if (editingId) {
      await dispatch(updateReserveItem({ id: editingId, item: payload }))
    } else {
      await dispatch(createReserveItem(payload))
    }
    resetForm()
  }

  const startEdit = (it) => {
    setEditingId(it._id)
    setForm({ itemId: it.itemId || '', item: it.item || '', amount: it.amount || '', description: it.description || '' })
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this reserve item?')) dispatch(deleteReserveItem(id))
  }

  return (
    <div className="reserve-page page-container">
      <div className="reserve-header balance-header">
        <h1>Reserve Items</h1>
        <div className="current-balance">
          <h2>{reserveItems.length} items</h2>
        </div>
      </div>

      <div className="balance-forms">
        <section className="form-section">
          <h3>{editingId ? 'Edit Reserve Item' : 'Add Reserve Item'}</h3>
          <form className="balance-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Item ID</label>
              <input name="itemId" value={form.itemId} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Item Name</label>
              <input name="item" value={form.item} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Amount</label>
              <input name="amount" type="number" value={form.amount} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input name="description" value={form.description} onChange={handleChange} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Create'}</button>
              <button type="button" className="btn" onClick={resetForm}>Reset</button>
            </div>
          </form>
        </section>

        <section className="balance-reports form-section">
          <h3>Reserve List</h3>
          <div className="reports-table">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Item ID</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reserveItems && reserveItems.length ? (
                  reserveItems.map((it) => (
                    <tr key={it._id}>
                      <td>{it.item}</td>
                      <td>{it.itemId}</td>
                      <td>{it.amount}</td>
                      <td>{it.description || '-'}</td>
                      <td>{new Date(it.date).toLocaleDateString()}</td>
                      <td className="item-actions">
                        <button className="btn" onClick={() => startEdit(it)}>Edit</button>
                        <button className="btn btn-danger" onClick={() => handleDelete(it._id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: 20 }}>
                      No reserve items
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Reserve
