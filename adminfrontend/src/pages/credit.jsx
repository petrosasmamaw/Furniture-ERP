import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCredits, createCredit } from '../slice/creditsSlice';
import { fetchCreditReports, createCreditReport } from '../slice/creditReportsSlice';
import { ethiopianNow } from '../utils/ethiopianDate';

const Credit = () => {
  const dispatch = useDispatch();
  const { credits } = useSelector((state) => state.credits);
  const { creditReports, status: reportStatus } = useSelector((state) => state.creditReports);

  const [creditInForm, setCreditInForm] = useState({ paymentId: '', amount: '', description: '' });
  const [creditOutForm, setCreditOutForm] = useState({ paymentId: '', amount: '', description: '' });
  const [outError, setOutError] = useState('');

  useEffect(() => {
    dispatch(fetchCredits());
    dispatch(fetchCreditReports());
  }, [dispatch]);

  const sortedReports = [...creditReports].sort((a, b) => new Date(b.date) - new Date(a.date));

  const currentCredit = sortedReports.length > 0
    ? sortedReports[0].remainingCredit
    : credits.reduce((sum, c) => sum + (c.amount || 0), 0);

  

  const handleCreditInSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(creditInForm.amount);
    if (isNaN(amount) || amount <= 0) return;

    const reportData = {
      paymentId: creditInForm.paymentId,
      type: 'Credit Taken',
      amount,
      description: creditInForm.description,
      remainingCredit: currentCredit + amount,
      date: new Date().toISOString(),
      ethiopianDate: ethiopianNow().toString()
    };

    try {
      await dispatch(createCreditReport(reportData));
      await dispatch(createCredit({
        paymentId: reportData.paymentId,
        amount: reportData.remainingCredit,
        description: reportData.description,
        date: reportData.date
      }));
      setCreditInForm({ paymentId: '', amount: '', description: '' });
      dispatch(fetchCreditReports());
      dispatch(fetchCredits());
    } catch (err) {
      console.error('Error creating credit in report', err);
    }
  };

  const handleCreditOutSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(creditOutForm.amount);
    if (isNaN(amount) || amount <= 0) {
      setOutError('Enter a valid amount');
      return;
    }
    if (amount > currentCredit) {
      setOutError('Insufficient credit — remaining cannot go negative');
      return;
    }
    setOutError('');

    const reportData = {
      paymentId: creditOutForm.paymentId,
      type: 'Credit Paid',
      amount,
      description: creditOutForm.description,
      remainingCredit: currentCredit - amount,
      date: new Date().toISOString(),
      ethiopianDate: ethiopianNow().toString()
    };

    try {
      await dispatch(createCreditReport(reportData));
      await dispatch(createCredit({
        paymentId: reportData.paymentId,
        amount: reportData.remainingCredit,
        description: reportData.description,
        date: reportData.date
      }));
      setCreditOutForm({ paymentId: '', amount: '', description: '' });
      dispatch(fetchCreditReports());
      dispatch(fetchCredits());
    } catch (err) {
      console.error('Error creating credit out report', err);
    }
  };

  return (
    <div className="page-container">
      <div className="balance-page">
        <div className="balance-header">
          <h1>Credit Management</h1>
          <div className="current-balance">
            <h2>Current Credit: ${currentCredit.toFixed(2)}</h2>
          </div>
        </div>

        <div className="balance-forms">
          <div className="form-section">
            <h3>Credit In</h3>
            <form onSubmit={handleCreditInSubmit} className="balance-form">
              <div className="form-group">
                <label>Payment ID:</label>
                <input type="text" value={creditInForm.paymentId} onChange={(e) => setCreditInForm({ ...creditInForm, paymentId: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Amount:</label>
                <input type="number" step="0.01" value={creditInForm.amount} onChange={(e) => setCreditInForm({ ...creditInForm, amount: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <input type="text" value={creditInForm.description} onChange={(e) => setCreditInForm({ ...creditInForm, description: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Remaining Credit after transaction:</label>
                <span>${(currentCredit + parseFloat(creditInForm.amount || 0)).toFixed(2)}</span>
              </div>
              <button type="submit" className="btn btn-primary">Add Credit In</button>
            </form>
          </div>

          <div className="form-section">
            <h3>Credit Out</h3>
            <form onSubmit={handleCreditOutSubmit} className="balance-form">
              <div className="form-group">
                <label>Payment ID:</label>
                <input type="text" value={creditOutForm.paymentId} onChange={(e) => setCreditOutForm({ ...creditOutForm, paymentId: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Amount:</label>
                <input type="number" step="0.01" value={creditOutForm.amount} onChange={(e) => setCreditOutForm({ ...creditOutForm, amount: e.target.value })} required max={currentCredit} />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <input type="text" value={creditOutForm.description} onChange={(e) => setCreditOutForm({ ...creditOutForm, description: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Remaining Credit after transaction:</label>
                <span>${(currentCredit - parseFloat(creditOutForm.amount || 0)).toFixed(2)}</span>
              </div>
              {outError && <div style={{ color: 'red', marginBottom: 8 }}>{outError}</div>}
              <button type="submit" className="btn btn-danger">Add Credit Out</button>
            </form>
          </div>
        </div>

        <div className="balance-reports">
          <h3>Credit Reports</h3>
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
                      <th>Remaining Credit</th>
                      <th>Date</th>
                      <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedReports.map((report) => (
                    <tr key={report._id}>
                      <td>{report.paymentId}</td>
                      <td className={report.type === 'Credit Taken' ? 'type-added' : 'type-used'}>{report.type}</td>
                      <td>${report.amount.toFixed(2)}</td>
                      <td>${report.remainingCredit.toFixed(2)}</td>
                      <td>{report.ethiopianDate || (typeof report.date === 'string' ? report.date : new Date(report.date).toLocaleString())}</td>
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

export default Credit;
