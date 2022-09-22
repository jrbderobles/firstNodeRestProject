const express = require('express');
const { body } = require('express-validator');

const usersController = require('../controllers/users');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/status', isAuth, usersController.getStatus);

router.put(
  '/status',
  isAuth,
  [
    body('status')
      .trim()
      .not()
      .isEmpty()
  ],
  usersController.updateStatus
);

module.exports = router;