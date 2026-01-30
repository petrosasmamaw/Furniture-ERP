import express from 'express';
const router = express.Router();
import { getOrders, getOrderById, createOrder, updateOrder, deleteOrder } from '../controllers/OrderController.js';

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

export default router;