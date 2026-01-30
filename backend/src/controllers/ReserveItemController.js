const ReserveItem = require('../models/ReserveItem');

exports.getReserveItems = async (req, res) => {
  try {
    const reserveItems = await ReserveItem.find();
    res.json(reserveItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReserveItemById = async (req, res) => {
  try {
    const reserveItem = await ReserveItem.findById(req.params.id);
    if (!reserveItem) return res.status(404).json({ message: 'ReserveItem not found' });
    res.json(reserveItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createReserveItem = async (req, res) => {
  const reserveItem = new ReserveItem(req.body);
  try {
    const newReserveItem = await reserveItem.save();
    res.status(201).json(newReserveItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateReserveItem = async (req, res) => {
  try {
    const updatedReserveItem = await ReserveItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedReserveItem) return res.status(404).json({ message: 'ReserveItem not found' });
    res.json(updatedReserveItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteReserveItem = async (req, res) => {
  try {
    const deletedReserveItem = await ReserveItem.findByIdAndDelete(req.params.id);
    if (!deletedReserveItem) return res.status(404).json({ message: 'ReserveItem not found' });
    res.json({ message: 'ReserveItem deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};