const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const {
  getSummary,
  getAnalytics,
  getWeekly,
  getRecentOrders
} = require('../controllers/dashboardController');

// All dashboard endpoints protected by JWT
router.use(verifyToken);

router.get('/summary', getSummary);
router.get('/analytics', getAnalytics);
router.get('/weekly', getWeekly);
router.get('/recent-orders', getRecentOrders);

module.exports = router;
