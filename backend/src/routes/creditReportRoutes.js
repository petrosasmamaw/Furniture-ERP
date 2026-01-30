const express = require('express');
const router = express.Router();
const creditReportController = require('../controllers/CreditReportController');

router.get('/', creditReportController.getCreditReports);
router.get('/:id', creditReportController.getCreditReportById);
router.post('/', creditReportController.createCreditReport);
router.put('/:id', creditReportController.updateCreditReport);
router.delete('/:id', creditReportController.deleteCreditReport);

module.exports = router;