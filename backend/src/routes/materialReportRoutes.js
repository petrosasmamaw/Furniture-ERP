import express from 'express';
const router = express.Router();
import { getMaterialReports, getMaterialReportById, createMaterialReport, updateMaterialReport, deleteMaterialReport } from '../controllers/MaterialReportController.js';

router.get('/', getMaterialReports);
router.get('/:id', getMaterialReportById);
router.post('/', createMaterialReport);
router.put('/:id', updateMaterialReport);
router.delete('/:id', deleteMaterialReport);

export default router;