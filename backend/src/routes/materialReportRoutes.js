const express = require('express');
const router = express.Router();
const materialReportController = require('../controllers/MaterialReportController');

router.get('/', materialReportController.getMaterialReports);
router.get('/:id', materialReportController.getMaterialReportById);
router.post('/', materialReportController.createMaterialReport);
router.put('/:id', materialReportController.updateMaterialReport);
router.delete('/:id', materialReportController.deleteMaterialReport);

module.exports = router;