const express = require('express');
const router = express.Router();
const reserveItemController = require('../controllers/ReserveItemController');

router.get('/', reserveItemController.getReserveItems);
router.get('/:id', reserveItemController.getReserveItemById);
router.post('/', reserveItemController.createReserveItem);
router.put('/:id', reserveItemController.updateReserveItem);
router.delete('/:id', reserveItemController.deleteReserveItem);

module.exports = router;