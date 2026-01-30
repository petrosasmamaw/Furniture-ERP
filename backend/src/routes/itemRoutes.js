import express from 'express';
const router = express.Router();
import { getItems, getItemById, createItem, updateItem, deleteItem } from '../controllers/ItemController.js';

router.get('/', getItems);
router.get('/:id', getItemById);
router.post('/', createItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

export default router;