import OrderReport from '../models/OrderReport.js';

export const getOrderReports = async (req, res) => {
  try {
    const reports = await OrderReport.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOrderReportById = async (req, res) => {
  try {
    const report = await OrderReport.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'OrderReport not found' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createOrderReport = async (req, res) => {
  const report = new OrderReport(req.body);
  try {
    const newReport = await report.save();
    res.status(201).json(newReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateOrderReport = async (req, res) => {
  try {
    const updatedReport = await OrderReport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedReport) return res.status(404).json({ message: 'OrderReport not found' });
    res.json(updatedReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteOrderReport = async (req, res) => {
  try {
    const deletedReport = await OrderReport.findByIdAndDelete(req.params.id);
    if (!deletedReport) return res.status(404).json({ message: 'OrderReport not found' });
    res.json({ message: 'OrderReport deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOrderReportsByItemId = async (req, res) => {
  try {
    const { itemId } = req.params;
    // match either the top-level itemId field or any itemsUsed.item entries
    const reports = await OrderReport.find({
      $or: [
        { itemId },
        { 'itemsUsed.item': itemId }
      ]
    });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};