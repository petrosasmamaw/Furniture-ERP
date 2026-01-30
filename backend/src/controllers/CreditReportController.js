import CreditReport from '../models/CreditReport.js';

export const getCreditReports = async (req, res) => {
  try {
    const reports = await CreditReport.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCreditReportById = async (req, res) => {
  try {
    const report = await CreditReport.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'CreditReport not found' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createCreditReport = async (req, res) => {
  const report = new CreditReport(req.body);
  try {
    const newReport = await report.save();
    res.status(201).json(newReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateCreditReport = async (req, res) => {
  try {
    const updatedReport = await CreditReport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedReport) return res.status(404).json({ message: 'CreditReport not found' });
    res.json(updatedReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteCreditReport = async (req, res) => {
  try {
    const deletedReport = await CreditReport.findByIdAndDelete(req.params.id);
    if (!deletedReport) return res.status(404).json({ message: 'CreditReport not found' });
    res.json({ message: 'CreditReport deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};