const express = require('express');
const router = express.Router();
const machineController = require('../controllers/MachineController');

router.get('/', machineController.getMachines);
router.get('/:id', machineController.getMachineById);
router.post('/', machineController.createMachine);
router.put('/:id', machineController.updateMachine);
router.delete('/:id', machineController.deleteMachine);

module.exports = router;