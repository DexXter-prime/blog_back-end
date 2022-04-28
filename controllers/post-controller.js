const { validationResult } = require('express-validator');
const postService = require('../service/post-service');
const ApiError = require('../exceptions/api-error');

class PostController {
  async getAllPosts(req, res, next) {
    try {
      const allPosts = await postService.getAll();
      return res.json(allPosts);
    } catch (err) {
      next(err);
    }
  }

  async getAllPostsByTagName(req, res, next) {
    try {
      const { tagname } = req.params;
      const postsByTagName = await postService.getAllPostsByTagName(tagname);
      return res.json(postsByTagName);
    } catch (err) {
      next(err);
    }
  }

  async getOnePost(req, res, next) {
    try {
      const postId = req.params.id;
      const post = await postService.getOne(postId);
      return res.json(post);
    } catch (err) {
      next(err);
    }
  }

  async createPost(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        ApiError.BadRequest('Error validation', errors.array());
      }
      const { title, content, tags } = req.body;
      const author = req.user.name;
      const userId = req.user.id;
      const imageSource = req.file?.filename || null;
      const newPost = await postService.create(title, content, author, userId, imageSource, tags);
      return res.json(newPost);
    } catch (err) {
      next(err);
    }
  }

  async deletePost(req, res, next) {
    try {
      const postId = req.params.id;
      const userId = req.user.id;
      const postData = await postService.delete(postId, userId);
      return res.json({ msg: 'Post has been deleted', postData });
    } catch (err) {
      next(err);
    }
  }

  async updatePost(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        ApiError.BadRequest('Error validation', errors.array());
      }
      const { title, content, tags } = req.body;
      const postId = req.params.id;
      const userId = req.user.id;
      const imageSource = (typeof req.body.image === 'string' && req.body.image !== 'null' ? req.body.image : req.file?.filename) || null;
      if (req.body.incrementMsg === '++') {
        const updatedPost = await postService.likeHandler(postId, userId);
        return res.json({ msg: 'Post has been updated', updatedPost });
      }
      const updatedPost = await postService.update(postId, title, content, userId, imageSource, tags);
      return res.json({ msg: 'Post has been updated', updatedPost });
    } catch (err) {
      next(err);
    }
  }

  async isLikeExists(req, res) {
    const { postId, userId } = req.body;
    const isLiked = await postService.likeCheck(postId, userId);
    return res.json({ isLiked });
  }
}

module.exports = new PostController();
