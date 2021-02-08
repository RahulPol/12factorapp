const path = require("path");
const { validationResult } = require("express-validator/check");

const {
  HTTP_OK,
  HTTP_CREATED,
  HTTP_VALIDATION_FAILED,
} = require("../common/constants");
const { getBaseURL } = require("../common/utilities");

exports.getPosts = (req, res, next) => {
  // .json will set "Content-Type":"application/json" response header
  res.status(HTTP_OK).json({
    posts: [
      {
        title: "First post",
        content: "This is first post!",
        imageUrl: getBaseURL(req) + "/images/avatar-female.jpg",
        creator: {
          name: "Rahul Pol",
        },
        createdAt: new Date(),
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HTTP_VALIDATION_FAILED).json({
      message: " Validation failed. Entered data is incorrect! ",
      errors: errors.array(),
    });
  }

  const title = req.body.title;
  const content = req.body.content;

  //TODO: create a post in Db
  res.status(HTTP_CREATED).json({
    message: "Post created successfully!",
    post: {
      _id: new Date().toISOString(),
      title,
      content,
      imageUrl: getBaseURL(req) + "/images/avatar-female.jpg",
      creator: {
        name: "Rahul Pol",
      },
      createdAt: new Date(),
    },
  });
};
