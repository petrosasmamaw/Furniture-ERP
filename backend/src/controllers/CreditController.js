import Credit from '../models/Credit.js';

export const getCredits = async (req, res) => {
  try {
    const credits = await Credit.find();
    res.json(credits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCreditById = async (req, res) => {
  try {
    const credit = await Credit.findById(req.params.id);
    if (!credit) return res.status(404).json({ message: 'Credit not found' });
    res.json(credit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createCredit = async (req, res) => {
  const credit = new Credit(req.body);
  try {
    const newCredit = await credit.save();
    res.status(201).json(newCredit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateCredit = async (req, res) => {
  try {
    const updatedCredit = await Credit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCredit) return res.status(404).json({ message: 'Credit not found' });
    res.json(updatedCredit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteCredit = async (req, res) => {
  try {
    const deletedCredit = await Credit.findByIdAndDelete(req.params.id);
    if (!deletedCredit) return res.status(404).json({ message: 'Credit not found' });
    res.json({ message: 'Credit deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};