import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import {
  fetchReserveItems,
  fetchReserveItemsByOrderName,
  createReserveItem,
  updateReserveItem,
  deleteReserveItem,
} from '../slice/reserveItemsSlice'
import { ethiopianNow } from '../utils/ethiopianDate'
import { fetchItems, updateItem } from '../slice/itemsSlice'
import { createMaterialReport } from '../slice/materialReportsSlice'

const Reserve = () => {
  const dispatch = useDispatch()
  const { reserveItems, status } = useSelector((state) => state.reserveItems)
  const { items } = useSelector((state) => state.items)

  const [searchParams] = useSearchParams()
  const orderName = searchParams.get('orderName') || ''

  const [form, setForm] = useState({ itemId: '', item: '', amount: '', description: '' })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    dispatch(fetchItems())
  }, [dispatch])

  useEffect(() => {
    if (orderName) dispatch(fetchReserveItemsByOrderName(orderName))
    else if (status === 'idle') dispatch(fetchReserveItems())
  }, [dispatch, status, orderName])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const resetForm = () => {
    setForm({ itemId: '', item: '', amount: '', description: '' })
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const selected = items.find(i => i._id === form.itemId)
    if (!selected) return alert('Please select an item')
    const amount = Number(form.amount) || 0
    const payload = {
      orderName,
      itemId: selected._id,
      item: selected.name,
      amount,
      description: form.description || `Reserve ${selected.name} for ${orderName}`,
      date: ethiopianNow().toString()
    }

    try {
      if (editingId) {
        await dispatch(updateReserveItem({ id: editingId, item: payload })).unwrap()
      } else {
        await dispatch(createReserveItem(payload)).unwrap()

        // decrease item quantity locally via updateItem
        const newQty = Math.max(0, (selected.quantity || 0) - amount)
        await dispatch(updateItem({ id: selected._id, item: { ...selected, quantity: newQty } })).unwrap()

        // create material report for the outflow
        await dispatch(createMaterialReport({
          item: selected._id,
          description: payload.description,
          inQty: 0,
          outQty: amount,
          remainingStock: newQty,
          date: new Date()
        })).unwrap()
      }
      resetForm()
      // refresh reserve list for this order
      if (orderName) dispatch(fetchReserveItemsByOrderName(orderName))
      else dispatch(fetchReserveItems())
    } catch (err) {
      console.error('Reserve create/update error', err)
      alert('Error creating reserve')
    }
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
              <label>Order</label>
              <input value={orderName} readOnly />
            </div>
              <div className="form-group">
              <label>Item</label>
              <select name="itemId" value={form.itemId} onChange={(e) => {
                const id = e.target.value
                const sel = items.find(i => i._id === id)
                const desc = sel ? `Reserve ${sel.name} for ${orderName}` : ''
                setForm({ ...form, itemId: id, item: sel ? sel.name : '', description: desc })
              }} required className="item-select">
                <option value="">-- select item --</option>
                {items && items.map(it => (
                  <option key={it._id} value={it._id}>{it.name} (available: {it.quantity || 0})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Amount</label>
              <input name="amount" type="number" value={form.amount} onChange={handleChange} required className="amount-input" />
            </div>
            {/* description is auto-generated from selected item and orderName */}
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
                              <td>{typeof it.date === 'string' ? it.date : new Date(it.date).toLocaleDateString()}</td>
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
