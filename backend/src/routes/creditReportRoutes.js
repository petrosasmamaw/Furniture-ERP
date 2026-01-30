import express from 'express';
const router = express.Router();
import { getCreditReports, getCreditReportById, createCreditReport, updateCreditReport, deleteCreditReport } from '../controllers/CreditReportController.js';

router.get('/', getCreditReports);
router.get('/:id', getCreditReportById);
router.post('/', createCreditReport);
router.put('/:id', updateCreditReport);
router.delete('/:id', deleteCreditReport);

export default router;