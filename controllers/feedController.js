const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");

const Post = require("../models/postModel");

const constants = require("../common/constants");
const { getBaseURL } = require("../common/utilities");

exports.getPosts = (req, res, next) => {
  // .json will set "Content-Type":"application/json" response header
  Post.find()
    .then((posts) => {
      res.status(constants.HTTP_OK).json(posts);
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
  const imageUrl = req.file.path.replace("public\\", "").trim();
  const post = new Post({
    title,
    content,
    imageUrl: path.join(getBaseURL(req), imageUrl),
    creator: {
      name: "Rahul Pol",
    },
  });
  post
    .save()
    .then((result) => {
      console.log(result);
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
  Post.findById(postId)
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
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updatePost = (req, res, next) => {
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

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("The post not found!");
        error.statusCode = constants.HTTP_NOT_FOUND;
        throw error;
      }
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.imageUrl = path.join(getBaseURL(req), imageUrl);
      post.content = content;
      return post.save();
    })
    .then((result) => {
      res.status(constants.HTTP_OK).json(result);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", "public", filePath);
  fs.unlink(filePath, (err) => {
    // const error = new Error("Error while clearing previous image");
    // error.statusCode = constants.HTTP_INTERNAL_SERVER_ERROR;
    // next(err);
    console.log(err);
  });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("The post not found!");
        error.statusCode = constants.HTTP_NOT_FOUND;
        throw error;
      }
      return Post.findByIdAndRemove(postId);
    })
    .then((result) => {
      res
        .status(constants.HTTP_OK)
        .json({ message: "Deleted post successfully." });
    })
    .catch((err) => {
      console.log("failure in delete", err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
