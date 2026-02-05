import React, { useState } from 'react';

const PriceCalculator = () => {
  const [rows, setRows] = useState([{ name: '', amount: '', price: '' }]);
  const [results, setResults] = useState(null);

  const updateRow = (index, field, value) => {
    const next = [...rows];
    next[index] = { ...next[index], [field]: value };
    setRows(next);
  };

  const addRow = () => setRows([...rows, { name: '', amount: '', price: '' }]);

  const calculate = () => {
    const descriptions = [];
    let total = 0;
    rows.forEach((r) => {
      const amt = parseFloat(r.amount) || 0;
      const pr = parseFloat(r.price) || 0;
      const subtotal = amt * pr;
      if ((r.name || '').trim() !== '') {
        descriptions.push(`${r.name}: ${subtotal.toFixed(2)}`);
      }
      total += subtotal;
    });
    setResults({ descriptions, total });
  };

  const reset = () => {
    setRows([{ name: '', amount: '', price: '' }]);
    setResults(null);
  };

  return (
    <div className="page-container">
      <div className="balance-page">
        <div className="balance-header">
          <h1>Price Calculator</h1>
        </div>

        <div className="form-section">
          {rows.map((r, i) => (
            <div className="price-row" key={i}>
              <input className="price-input" placeholder="Name" value={r.name} onChange={(e) => updateRow(i, 'name', e.target.value)} />
              <input className="price-input" placeholder="Amount" type="number" value={r.amount} onChange={(e) => updateRow(i, 'amount', e.target.value)} />
              <input className="price-input" placeholder="Price" type="number" value={r.price} onChange={(e) => updateRow(i, 'price', e.target.value)} />
              {i === rows.length - 1 && (
                <button type="button" className="btn add-row-btn" onClick={addRow}>+</button>
              )}
            </div>
          ))}

          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <button type="button" className="btn btn-primary calc-btn" onClick={calculate}>Calculate</button>
            <button type="button" className="btn" onClick={reset}>Reset</button>
          </div>

          {results && (
            <div className="price-results">
              <h3>Results</h3>
              <ul>
                {results.descriptions.map((d, idx) => <li key={idx}>{d}</li>)}
              </ul>
              <h4>Total: {results.total.toFixed(2)}</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceCalculator;
