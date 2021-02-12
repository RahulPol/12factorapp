const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");

const constants = require("../common/constants");
const { getBaseURL, clearImage } = require("../common/utilities");
const dbUtil = require("../models/dbUtil");

const IDatabase = dbUtil.getDbInstance(process.env.DATABASE);

exports.getPosts = (req, res, next) => {
  console.log(IDatabase);
  const currentPage = req.query.page || 0;
  let perPage = 2;
  let totalItems = 0;
  IDatabase.Post.getPosts(currentPage, perPage)
    .then((result) => {
      totalItems = result.totalItems;
      return result.posts;
    })
    .then((posts) => {
      res.status(constants.HTTP_OK).json({ posts, totalItems, perPage });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = constants.HTTP_INTERNAL_SERVER_ERROR;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let error = new Error("Validation failed. Entered data is incorrect! ");
    error.statusCode = constants.HTTP_VALIDATION_FAILED;
    error.errors = errors.array();
    throw error;
  }
  if (!req.file) {
    const error = new Error("No image provided");
    error.statusCode = constants.HTTP_VALIDATION_FAILED;
    throw error;
  }

  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.file.path.replace("public\\", "").trim();
  imageUrl = path.join(getBaseURL(req), imageUrl);

  IDatabase.Post.createPost({ title, content, imageUrl })
    .then((result) => {
      res.status(constants.HTTP_CREATED).json({
        message: "Post created successfully!",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = constants.HTTP_INTERNAL_SERVER_ERROR;
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;

  IDatabase.Post.getPost(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("The post not found!");
        error.statusCode = constants.HTTP_NOT_FOUND;
        throw error;
      }
      res.status(constants.HTTP_OK).json(post);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = constants.HTTP_INTERNAL_SERVER_ERROR;
      }
      next(err);
    });
};

exports.updatePost = (req, res, next) => {
  console.log("in controller");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let error = new Error("Validation failed. Entered data is incorrect! ");
    error.statusCode = constants.HTTP_VALIDATION_FAILED;
    error.errors = errors.array();
    throw error;
  }
  const postId = req.params.postId;
  const { title, content } = req.body;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path.replace("public\\", "").trim();
  }
  if (!imageUrl) {
    const error = new Error("No file picked.");
    error.statusCode = constants.HTTP_VALIDATION_FAILED;
    throw error;
  }
  imageUrl = path.join(getBaseURL(req), imageUrl);

  IDatabase.Post.updatePost(postId, { title, content, imageUrl })
    .then((result) => {
      if (imageUrl !== result.imageUrl) {
        clearImage(post.imageUrl);
      }
      res.status(constants.HTTP_OK).json(result);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = constants.HTTP_INTERNAL_SERVER_ERROR;
      }
      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;

  IDatabase.Post.deletePost(postId)
    .then((post) => {
      clearImage(post.imageUrl);
      res
        .status(constants.HTTP_OK)
        .json({ message: "Deleted post successfully." });
    })
    .catch((err) => {
      console.log("failure in delete", err);
      if (!err.statusCode) {
        err.statusCode = constants.HTTP_INTERNAL_SERVER_ERROR;
      }
      next(err);
    });
};
