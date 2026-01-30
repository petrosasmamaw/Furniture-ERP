import express from 'express';
const router = express.Router();
import { getOrderReports, getOrderReportById, createOrderReport, updateOrderReport, deleteOrderReport } from '../controllers/OrderReportController.js';

router.get('/', getOrderReports);
router.get('/:id', getOrderReportById);
router.post('/', createOrderReport);
router.put('/:id', updateOrderReport);
router.delete('/:id', deleteOrderReport);

export default router;