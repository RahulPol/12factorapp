const { validationResult } = require("express-validator/check");

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

  // res.status(constants.HTTP_OK).json({
  //   posts: [
  //     {
  //       title: "First post",
  //       content: "This is first post!",
  //       imageUrl: getBaseURL(req) + "/images/avatar-female.jpg",
  //       creator: {
  //         name: "Rahul Pol",
  //       },
  //       createdAt: new Date(),
  //     },
  //   ],
  // });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let error = new Error("Validation failed. Entered data is incorrect! ");
    error.statusCode = constants.HTTP_VALIDATION_FAILED;
    error.errors = errors.array();
    throw error;
  }

  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title,
    content,
    imageUrl: getBaseURL(req) + "/images/avatar-female.jpg",
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
