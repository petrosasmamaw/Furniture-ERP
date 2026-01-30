const MachineReport = require('../models/MachineReport');

exports.getMachineReports = async (req, res) => {
  try {
    const reports = await MachineReport.find().populate('machine');
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMachineReportById = async (req, res) => {
  try {
    const report = await MachineReport.findById(req.params.id).populate('machine');
    if (!report) return res.status(404).json({ message: 'MachineReport not found' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createMachineReport = async (req, res) => {
  const report = new MachineReport(req.body);
  try {
    const newReport = await report.save();
    res.status(201).json(newReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateMachineReport = async (req, res) => {
  try {
    const updatedReport = await MachineReport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedReport) return res.status(404).json({ message: 'MachineReport not found' });
    res.json(updatedReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteMachineReport = async (req, res) => {
  try {
    const deletedReport = await MachineReport.findByIdAndDelete(req.params.id);
    if (!deletedReport) return res.status(404).json({ message: 'MachineReport not found' });
    res.json({ message: 'MachineReport deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};