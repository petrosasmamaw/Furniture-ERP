const Balance = require('../models/Balance');

exports.getBalances = async (req, res) => {
  try {
    const balances = await Balance.find();
    res.json(balances);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBalanceById = async (req, res) => {
  try {
    const balance = await Balance.findById(req.params.id);
    if (!balance) return res.status(404).json({ message: 'Balance not found' });
    res.json(balance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createBalance = async (req, res) => {
  const balance = new Balance(req.body);
  try {
    const newBalance = await balance.save();
    res.status(201).json(newBalance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateBalance = async (req, res) => {
  try {
    const updatedBalance = await Balance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBalance) return res.status(404).json({ message: 'Balance not found' });
    res.json(updatedBalance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteBalance = async (req, res) => {
  try {
    const deletedBalance = await Balance.findByIdAndDelete(req.params.id);
    if (!deletedBalance) return res.status(404).json({ message: 'Balance not found' });
    res.json({ message: 'Balance deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};