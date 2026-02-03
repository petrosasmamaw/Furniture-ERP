import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBalances, createBalance } from '../slice/balancesSlice';
import { fetchBalanceReports, createBalanceReport } from '../slice/balanceReportsSlice';
import { ethiopianNow } from '../utils/ethiopianDate';

const Balance = () => {
  const dispatch = useDispatch();
  const { balances,} = useSelector((state) => state.balances);
  const { balanceReports, status: reportStatus } = useSelector((state) => state.balanceReports);

  const [cashInForm, setCashInForm] = useState({ paymentId: '', amount: '', description: '' });
  const [cashOutForm, setCashOutForm] = useState({ paymentId: '', amount: '', description: '' });

  useEffect(() => {
    dispatch(fetchBalances());
    dispatch(fetchBalanceReports());
  }, [dispatch]);

  const sortedReports = [...balanceReports].sort((a, b) => new Date(b.date) - new Date(a.date));

  const currentBalance = sortedReports.length > 0
    ? sortedReports[0].remainingBalance
    : balances.reduce((sum, balance) => sum + (balance.amount || 0), 0);

  const handleCashInSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(cashInForm.amount);
    if (isNaN(amount) || amount <= 0) return;

    const reportData = {
      paymentId: cashInForm.paymentId,
      type: 'Added',
      amount,
      description: cashInForm.description,
      remainingBalance: currentBalance + amount,
      date: ethiopianNow().toString()
    };

    try {
      await dispatch(createBalanceReport(reportData));
      await dispatch(createBalance({
        paymentId: reportData.paymentId,
        amount: reportData.remainingBalance,
        description: reportData.description,
        date: reportData.date
      }));
      setCashInForm({ paymentId: '', amount: '', description: '' });
      dispatch(fetchBalanceReports());
      dispatch(fetchBalances());
    } catch (error) {
      console.error('Error creating cash in report:', error);
    }
  };

  const handleCashOutSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(cashOutForm.amount);
    if (isNaN(amount) || amount <= 0 || amount > currentBalance) return;

    const reportData = {
      paymentId: cashOutForm.paymentId,
      type: 'Used',
      amount,
      description: cashOutForm.description,
      remainingBalance: currentBalance - amount,
      date: ethiopianNow().toString()
    };

    try {
      await dispatch(createBalanceReport(reportData));
      await dispatch(createBalance({
        paymentId: reportData.paymentId,
        amount: reportData.remainingBalance,
        description: reportData.description,
        date: reportData.date
      }));
      setCashOutForm({ paymentId: '', amount: '', description: '' });
      dispatch(fetchBalanceReports());
      dispatch(fetchBalances());
    } catch (error) {
      console.error('Error creating cash out report:', error);
    }
  };

  return (
    <div className="page-container">
      <div className="balance-page">
        <div className="balance-header">
          <h1>Balance Management</h1>
          <div className="current-balance">
            <h2>Current Balance: ${currentBalance.toFixed(2)}</h2>
          </div>
        </div>

        <div className="balance-forms">
          <div className="form-section">
            <h3>Cash In</h3>
            <form onSubmit={handleCashInSubmit} className="balance-form">
              <div className="form-group">
                <label>Payment ID:</label>
                <input type="text" value={cashInForm.paymentId} onChange={(e) => setCashInForm({ ...cashInForm, paymentId: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Amount:</label>
                <input type="number" step="0.01" value={cashInForm.amount} onChange={(e) => setCashInForm({ ...cashInForm, amount: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <input type="text" value={cashInForm.description} onChange={(e) => setCashInForm({ ...cashInForm, description: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Remaining Balance after transaction:</label>
                <span>${(currentBalance + parseFloat(cashInForm.amount || 0)).toFixed(2)}</span>
              </div>
              <button type="submit" className="btn btn-primary">Add Cash In</button>
            </form>
          </div>

          <div className="form-section">
            <h3>Cash Out</h3>
            <form onSubmit={handleCashOutSubmit} className="balance-form">
              <div className="form-group">
                <label>Payment ID:</label>
                <input type="text" value={cashOutForm.paymentId} onChange={(e) => setCashOutForm({ ...cashOutForm, paymentId: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Amount:</label>
                <input type="number" step="0.01" value={cashOutForm.amount} onChange={(e) => setCashOutForm({ ...cashOutForm, amount: e.target.value })} required max={currentBalance} />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <input type="text" value={cashOutForm.description} onChange={(e) => setCashOutForm({ ...cashOutForm, description: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Remaining Balance after transaction:</label>
                <span>${(currentBalance - parseFloat(cashOutForm.amount || 0)).toFixed(2)}</span>
              </div>
              <button type="submit" className="btn btn-danger">Add Cash Out</button>
            </form>
          </div>
        </div>

        <div className="balance-reports">
          <h3>Balance Reports</h3>
          {reportStatus === 'loading' ? (
            <p>Loading reports...</p>
          ) : (
            <div className="reports-table">
              <table>
                <thead>
                  <tr>
                    <th>Payment ID</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Remaining Balance</th>
                    <th>Date</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedReports.map((report) => (
                    <tr key={report._id}>
                      <td>{report.paymentId}</td>
                      <td className={report.type === 'Added' ? 'type-added' : 'type-used'}>{report.type}</td>
                      <td>${report.amount.toFixed(2)}</td>
                      <td>${report.remainingBalance.toFixed(2)}</td>
                      <td>{typeof report.date === 'string' ? report.date : new Date(report.date).toLocaleString()}</td>
                      <td>{report.description}</td>
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

export default Balance;
