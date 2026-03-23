const express = require('express');
const router = express.Router();
const orderItemController = require('../controllers/orderItemController');

router.get('/', orderItemController.getOrderItems);
router.post('/', orderItemController.createOrderItem);
router.delete('/:id', orderItemController.deleteOrderItem);

module.exports = router;
