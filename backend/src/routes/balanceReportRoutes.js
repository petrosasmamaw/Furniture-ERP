const express = require('express');
const router = express.Router();
const balanceReportController = require('../controllers/BalanceReportController');

router.get('/', balanceReportController.getBalanceReports);
router.get('/:id', balanceReportController.getBalanceReportById);
router.post('/', balanceReportController.createBalanceReport);
router.put('/:id', balanceReportController.updateBalanceReport);
router.delete('/:id', balanceReportController.deleteBalanceReport);

module.exports = router;