import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchItemById } from '../slice/itemsSlice';
import { fetchMaterialReports } from '../slice/materialReportsSlice';

const ItemDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { currentItem, status: itemStatus } = useSelector((state) => state.items);
  const { materialReports, status: reportsStatus } = useSelector((state) => state.materialReports);

  useEffect(() => {
    if (id) dispatch(fetchItemById(id));
    dispatch(fetchMaterialReports());
  }, [dispatch, id]);

  // filter reports for this item and sort newest first
  const reportsForItem = (materialReports || []).filter(r => r.item && (r.item._id === id || r.item === id));
  const sortedReports = [...reportsForItem].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (itemStatus === 'loading' || !currentItem) {
    return <div className="page-container"><p>Loading item...</p></div>;
  }

  const { name, itemId, description, quantity, price } = currentItem || {};

  return (
    <div className="page-container">
      <div className="balance-page">
        <div className="balance-header">
          <div>
            <h1>{name}</h1>
            <p style={{opacity: 0.9}}>ID: {itemId}</p>
            <p style={{opacity: 0.85}}>Description: {description || '—'}</p>
          </div>
          <div className="current-balance">
            <h2>Qty: {quantity} — {price?.toFixed(2)} Birr</h2>
          </div>
        </div>

        <div className="balance-reports">
          <h3>Material Reports for {name}</h3>
          {reportsStatus === 'loading' ? (
            <p>Loading reports...</p>
          ) : (
            <div className="reports-table">
              <table>
                <thead>
                  <tr>
                    <th>In Qty</th>
                    <th>Out Qty</th>
                    <th>Remaining</th>
                    <th>Date</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedReports.map(r => (
                    <tr key={r._id}>
                      <td>{r.inQty}</td>
                      <td>{r.outQty}</td>
                      <td>{r.remainingStock}</td>
                      <td>{r.ethiopianDate || (typeof r.date === 'string' ? r.date : new Date(r.date).toLocaleString())}</td>
                       <td>{r.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;

