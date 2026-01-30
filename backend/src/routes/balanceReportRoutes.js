import express from 'express';
const router = express.Router();
import { getBalanceReports, getBalanceReportById, createBalanceReport, updateBalanceReport, deleteBalanceReport } from '../controllers/BalanceReportController.js';

router.get('/', getBalanceReports);
router.get('/:id', getBalanceReportById);
router.post('/', createBalanceReport);
router.put('/:id', updateBalanceReport);
router.delete('/:id', deleteBalanceReport);

export default router;