const express = require('express');
const {
  validateUserId, validateUser, validatePost
} = require("../middleware/middleware.js");

const User = require("../users/users-model.js");
const Post = require("../posts/posts-model.js");

const router = express.Router();

router.get('/', (req, res, next) => {
  User.get()
    .then((users) => { 
      res.json(users) 
    })
    .catch(next)
});

router.get('/:id', validateUserId, (req, res) => {
  res.json(req.user);
});

router.post('/', validateUser, (req, res, next) => {
  User.insert({ name: req.name })
    .then((newUser) => {
      res.json(newUser)
    })
    .catch(next)
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  User.update(req.params.id, { name: req.name })
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch(next)
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  try {
    await User.remove(req.params.id);
    res.json(req.user);
  } catch (error) {
    next(error);
  }
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  try {
    const post = await User.getUserPosts(req.params.id);
    res.json(post);
  } catch (error) {
    next(error);
  }  
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res, next) => {
  try {
    const result = await Post.insert({ user_id: req.params.id, text: req.text })
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.message,
    customMessage: "something went wrong inside posts router"
  })
})

module.exports = router;