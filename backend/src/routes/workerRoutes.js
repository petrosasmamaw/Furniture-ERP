import express from 'express';
const router = express.Router();
import { getWorkers, getWorkerById, createWorker, updateWorker, deleteWorker } from '../controllers/WorkerController.js';

router.get('/', getWorkers);
router.get('/:id', getWorkerById);
router.post('/', createWorker);
router.put('/:id', updateWorker);
router.delete('/:id', deleteWorker);

export default router;