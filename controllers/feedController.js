const path = require("path");

const { HTTP_OK, HTTP_CREATED } = require("../common/constants");
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
  const title = req.body.title;
  const content = req.body.content;

  //TODO: create a post in Db
  res.status(HTTP_CREATED).json({
    message: "Post created successfully!",
    post: { id: new Date().toISOString(), title, content },
  });
};
