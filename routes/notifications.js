const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Notification = require('../models/Notification');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('unreadOnly').optional().isBoolean()
], authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const unreadOnly = req.query.unreadOnly === 'true';

    // Build filter
    const filter = { userId: req.user._id };
    if (unreadOnly) {
      filter.isRead = false;
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({ 
      userId: req.user._id, 
      isRead: false 
    });

    res.json({
      notifications,
      unreadCount,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalNotifications: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      message: 'Server error while fetching notifications'
    });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        message: 'Notification not found'
      });
    }

    await notification.markAsRead();

    res.json({
      message: 'Notification marked as read',
      notification
    });

  } catch (error) {
    console.error('Mark notification as read error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        message: 'Notification not found'
      });
    }
    res.status(500).json({
      message: 'Server error while updating notification'
    });
  }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', authenticateToken, async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json({
      message: 'All notifications marked as read',
      updatedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({
      message: 'Server error while updating notifications'
    });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        message: 'Notification not found'
      });
    }

    res.json({
      message: 'Notification deleted successfully'
    });

  } catch (error) {
    console.error('Delete notification error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        message: 'Notification not found'
      });
    }
    res.status(500).json({
      message: 'Server error while deleting notification'
    });
  }
});

// @route   GET /api/notifications/unread-count
// @desc    Get unread notifications count
// @access  Private
router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({
      userId: req.user._id,
      isRead: false
    });

    res.json({ unreadCount });

  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      message: 'Server error while fetching unread count'
    });
  }
});

module.exports = router;
