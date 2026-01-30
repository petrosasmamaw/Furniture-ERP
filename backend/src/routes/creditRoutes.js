const express = require('express');
const router = express.Router();
const creditController = require('../controllers/CreditController');

router.get('/', creditController.getCredits);
router.get('/:id', creditController.getCreditById);
router.post('/', creditController.createCredit);
router.put('/:id', creditController.updateCredit);
router.delete('/:id', creditController.deleteCredit);

module.exports = router;