const express = require('express');
const router = express.Router();
const orderReportController = require('../controllers/OrderReportController');

router.get('/', orderReportController.getOrderReports);
router.get('/:id', orderReportController.getOrderReportById);
router.post('/', orderReportController.createOrderReport);
router.put('/:id', orderReportController.updateOrderReport);
router.delete('/:id', orderReportController.deleteOrderReport);

module.exports = router;