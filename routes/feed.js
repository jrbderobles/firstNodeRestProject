const express = require('express');
const { body } = require('express-validator');

const feedsController = require('../controllers/feeds');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/posts', isAuth, feedsController.getPosts);

router.post(
  '/post',
  isAuth,
  [
    body('title')
      .trim()
      .isLength({min: 5}),
    body('content')
      .trim()
      .isLength({min: 5})
  ],
  feedsController.createPost
);

router.get('/posts/:postId', isAuth, feedsController.getPost);

router.put(
  '/posts/:postId',
  isAuth,
  [
    body('title')
      .trim()
      .isLength({min: 5}),
    body('content')
      .trim()
      .isLength({min: 5})
  ],
  feedsController.updatePost
);

router.delete('/posts/:postId', isAuth, feedsController.deletePost);

module.exports = router;