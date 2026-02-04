import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchMachineById } from '../slice/machinesSlice';
import { fetchMachineReports } from '../slice/machineReportsSlice';

const MachineDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { currentMachine, status: machineStatus } = useSelector((state) => state.machines);
  const { machineReports, status: reportsStatus } = useSelector((state) => state.machineReports);

  useEffect(() => {
    if (id) dispatch(fetchMachineById(id));
    dispatch(fetchMachineReports());
  }, [dispatch, id]);

  const reportsForMachine = (machineReports || []).filter(r => r.machine && (r.machine._id === id || r.machine === id));
  const sorted = [...reportsForMachine].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (machineStatus === 'loading' || !currentMachine) return <div className="page-container"><p>Loading machine...</p></div>;

  const { name, serialNumber, description, price, status, worker } = currentMachine || {};

  return (
    <div className="page-container">
      <div className="balance-page">
        <div className="balance-header">
          <div>
            <h1>{name}</h1>
            <p style={{opacity:0.9}}>Serial: {serialNumber}</p>
            <p style={{opacity:0.85}}>Desc: {description || '—'}</p>
            <p style={{opacity:0.85}}>Worker: {worker || '—'}</p>
          </div>
          <div className="current-balance">
            <h2>{status} — ${price?.toFixed(2)}</h2>
          </div>
        </div>

        <div className="balance-reports">
          <h3>Machine Reports for {name}</h3>
          {reportsStatus === 'loading' ? (
            <p>Loading reports...</p>
          ) : (
            <div className="reports-table">
              <table>
                <thead>
                  <tr>
                      <th>Worker</th>
                      <th>Status</th>
                      <th>Description</th>
                      <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                  {sorted.map(r => (
                    <tr key={r._id}>
                      <td className="worker-col">{r.worker || '—'}</td>
                      <td>{r.statusChange}</td>
                      <td>{r.description}</td>
                      <td>{r.ethiopianDate || (typeof r.date === 'string' ? r.date : new Date(r.date).toLocaleString())}</td>
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

export default MachineDetail;