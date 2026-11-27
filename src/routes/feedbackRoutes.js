const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

router.get('/', feedbackController.getFeedbacks);
router.get('/:id', feedbackController.getFeedbackById);
router.post('/', feedbackController.createFeedback);
router.delete('/:id', feedbackController.deleteFeedback);

module.exports = router;
