import express from 'express';
const router = express.Router();
import { getPurchases, getPurchaseById, createPurchase, updatePurchase, deletePurchase } from '../controllers/PurchaseController.js';

router.get('/', getPurchases);
router.get('/:id', getPurchaseById);
router.post('/', createPurchase);
router.put('/:id', updatePurchase);
router.delete('/:id', deletePurchase);

export default router; 