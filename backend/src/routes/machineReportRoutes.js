const express = require('express');
const router = express.Router();
const machineReportController = require('../controllers/MachineReportController');

router.get('/', machineReportController.getMachineReports);
router.get('/:id', machineReportController.getMachineReportById);
router.post('/', machineReportController.createMachineReport);
router.put('/:id', machineReportController.updateMachineReport);
router.delete('/:id', machineReportController.deleteMachineReport);

module.exports = router;