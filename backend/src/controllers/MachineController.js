import Machine from '../models/Machine.js';

export const getMachines = async (req, res) => {
  try {
    const machines = await Machine.find();
    res.json(machines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMachineById = async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id);
    if (!machine) return res.status(404).json({ message: 'Machine not found' });
    res.json(machine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createMachine = async (req, res) => {
  const machine = new Machine(req.body);
  try {
    const newMachine = await machine.save();
    res.status(201).json(newMachine);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateMachine = async (req, res) => {
  try {
    const updatedMachine = await Machine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMachine) return res.status(404).json({ message: 'Machine not found' });
    res.json(updatedMachine);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteMachine = async (req, res) => {
  try {
    const deletedMachine = await Machine.findByIdAndDelete(req.params.id);
    if (!deletedMachine) return res.status(404).json({ message: 'Machine not found' });
    res.json({ message: 'Machine deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};