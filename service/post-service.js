const fs = require('fs');

const {
  Post, Like,
} = require('../models');

const ApiError = require('../exceptions/api-error');

class PostService {
  async create(title, content, author, userId, imageSource, tags) {
    const words = tags ? tags.split(',').filter((word) => !!word && word.length > 3) : null;
    console.log(tags);

    const newPost = await Post.create({
      title,
      content,
      author,
      userId,
      imageSource,
      tags: words[0] === 'null' ? null : words,
    });

    return newPost;
  }

  async getAll() {
    const allPosts = await Post.findAll({
      order: [
        ['id', 'ASC'],
      ],
    });
    return allPosts;
  }

  async getAllPostsByTagName(tagname) {
    const allPosts = await Post.findAll();
    const postsByTagName = allPosts.filter((post) => post.tags)
      .filter((post) => post.tags.includes(tagname));

    return postsByTagName;
  }

  async getOne(id) {
    const postData = await Post.findOne({ where: { id } });
    return postData;
  }

  async delete(id, userId) {
    const currentPost = await Post.findOne({ where: { id } });
    if (currentPost.userId === userId) {
      if (currentPost.imageSource) {
        fs.unlinkSync(`${process.cwd()}\\static\\images\\${currentPost.imageSource}`);
      }
      const postData = await Post.destroy({ where: { id } });
      return postData;
    }

    throw ApiError.UnauthorizedError();
  }

  async update(id, title, content, userId, imageSource, tags) {
    const currentPost = await Post.findOne({ where: { id } });
    const words = tags.split(',').filter((word) => !!word && word.length > 3);

    if (currentPost.userId === userId) {
      if (currentPost.imageSource !== imageSource && currentPost.imageSource !== null) {
        console.log(currentPost.imageSource, 1111);
        console.log(imageSource, 222222);
        fs.unlinkSync(`${process.cwd()}\\static\\images\\${currentPost.imageSource}`);
      }
      const updatedPost = await Post.update({
        title, content, imageSource, tags: words[0] === 'null' ? null : words,
      }, { where: { id } });
      return updatedPost;
    }

    throw ApiError.UnauthorizedError();
  }

  async likeHandler(postId, userId) {
    let post = null;
    const isLiked = await Like.findOne({ where: { postId, userId } });
    if (isLiked) {
      await Like.destroy({ where: { id: isLiked.id } });
      await Post.decrement({ likeCounter: 1 }, { where: { id: postId } });
    } else {
      await Like.create({ postId, userId });
      await Post.increment({ likeCounter: 1 }, { where: { id: postId } });
    }
    post = await Post.findOne({ where: { id: postId } });
    return post;
  }

  async likeCheck(postId, userId) {
    const isLiked = await Like.findOne({ where: { postId, userId } });
    if (isLiked) {
      return true;
    }
    return false;
  }
}

module.exports = new PostService();
