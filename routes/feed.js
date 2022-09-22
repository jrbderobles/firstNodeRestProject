const express = require('express');

const feedsController = require('../controllers/feeds');

const router = express.Router();

router.get('/posts', feedsController.getPosts);
router.post('/post', feedsController.createPost);

module.exports = router;