import express from 'express';
const router = express.Router();
import { getMachineReports, getMachineReportById, createMachineReport, updateMachineReport, deleteMachineReport } from '../controllers/MachineReportController.js';

router.get('/', getMachineReports);
router.get('/:id', getMachineReportById);
router.post('/', createMachineReport);
router.put('/:id', updateMachineReport);
router.delete('/:id', deleteMachineReport);

export default router;