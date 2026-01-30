const MaterialReport = require('../models/MaterialReport');

exports.getMaterialReports = async (req, res) => {
  try {
    const reports = await MaterialReport.find().populate('item');
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMaterialReportById = async (req, res) => {
  try {
    const report = await MaterialReport.findById(req.params.id).populate('item');
    if (!report) return res.status(404).json({ message: 'MaterialReport not found' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createMaterialReport = async (req, res) => {
  const report = new MaterialReport(req.body);
  try {
    const newReport = await report.save();
    res.status(201).json(newReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateMaterialReport = async (req, res) => {
  try {
    const updatedReport = await MaterialReport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedReport) return res.status(404).json({ message: 'MaterialReport not found' });
    res.json(updatedReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteMaterialReport = async (req, res) => {
  try {
    const deletedReport = await MaterialReport.findByIdAndDelete(req.params.id);
    if (!deletedReport) return res.status(404).json({ message: 'MaterialReport not found' });
    res.json({ message: 'MaterialReport deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};