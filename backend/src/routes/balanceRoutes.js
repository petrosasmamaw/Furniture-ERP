import express from 'express';
const router = express.Router();
import { getBalances, getBalanceById, createBalance, updateBalance, deleteBalance } from '../controllers/BalanceController.js';

router.get('/', getBalances);
router.get('/:id', getBalanceById);
router.post('/', createBalance);
router.put('/:id', updateBalance);
router.delete('/:id', deleteBalance);

export default router;