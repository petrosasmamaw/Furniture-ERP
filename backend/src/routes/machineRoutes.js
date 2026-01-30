import express from 'express';
const router = express.Router();
import { getMachines, getMachineById, createMachine, updateMachine, deleteMachine } from '../controllers/MachineController.js';

router.get('/', getMachines);
router.get('/:id', getMachineById);
router.post('/', createMachine);
router.put('/:id', updateMachine);
router.delete('/:id', deleteMachine);

export default router;