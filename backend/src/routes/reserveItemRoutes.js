import express from 'express';
const router = express.Router();
import { getReserveItems, getReserveItemById, getReserveItemsByOrderName, createReserveItem, updateReserveItem, deleteReserveItem } from '../controllers/ReserveItemController.js';

router.get('/', getReserveItems);
router.get('/order/:orderName', getReserveItemsByOrderName);
router.get('/:id', getReserveItemById);
router.post('/', createReserveItem);
router.put('/:id', updateReserveItem);
router.delete('/:id', deleteReserveItem);

export default router;