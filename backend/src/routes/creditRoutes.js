import express from 'express';
const router = express.Router();
import { getCredits, getCreditById, createCredit, updateCredit, deleteCredit } from '../controllers/CreditController.js';

router.get('/', getCredits); 
router.get('/:id', getCreditById);
router.post('/', createCredit);
router.put('/:id', updateCredit);
router.delete('/:id', deleteCredit);

export default router; 