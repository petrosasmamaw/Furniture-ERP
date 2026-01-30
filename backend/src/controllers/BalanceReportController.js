import BalanceReport from '../models/BalanceReport.js';

export const getBalanceReports = async (req, res) => {
  try {
    const reports = await BalanceReport.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBalanceReportById = async (req, res) => {
  try {
    const report = await BalanceReport.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'BalanceReport not found' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createBalanceReport = async (req, res) => {
  const report = new BalanceReport(req.body);
  try {
    const newReport = await report.save();
    res.status(201).json(newReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateBalanceReport = async (req, res) => {
  try {
    const updatedReport = await BalanceReport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedReport) return res.status(404).json({ message: 'BalanceReport not found' });
    res.json(updatedReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteBalanceReport = async (req, res) => {
  try {
    const deletedReport = await BalanceReport.findByIdAndDelete(req.params.id);
    if (!deletedReport) return res.status(404).json({ message: 'BalanceReport not found' });
    res.json({ message: 'BalanceReport deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};