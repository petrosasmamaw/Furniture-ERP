const express = require('express');
const router = express.Router();
const balanceController = require('../controllers/BalanceController');

router.get('/', balanceController.getBalances);
router.get('/:id', balanceController.getBalanceById);
router.post('/', balanceController.createBalance);
router.put('/:id', balanceController.updateBalance);
router.delete('/:id', balanceController.deleteBalance);

module.exports = router;