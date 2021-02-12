const Post = require("../models/postModel");
const User = require("../models/userModel");
const constants = require("../common/constants");

class MongoPostUtil {
  async getPosts(currentPage, perPage) {
    let totalItems;
    try {
      const count = await Post.find().countDocuments();
      totalItems = count;
      const skipCount = currentPage == 0 ? 0 : (currentPage - 1) * perPage;
      const limitCount = currentPage == 0 ? totalItems : perPage;
      perPage = currentPage == 0 ? totalItems : perPage;
      return {
        posts: Post.find().skip(skipCount).limit(limitCount),
        totalItems,
      };
    } catch (err) {
      throw err;
    }
  }

  async createPost(postData) {
    const { title, content, imageUrl } = postData;
    const post = new Post({
      title,
      content,
      imageUrl,
      creator: {
        name: "Rahul Pol",
      },
    });

    try {
      const result = await post.save();
      return Promise.resolve(result);
    } catch (err) {
      throw err;
    }
  }

  getPost(postId) {
    return Post.findById(postId);
  }

  async updatePost(postId, putData) {
    const { title, content, imageUrl } = putData;
    try {
      console.log(postId);
      const post = await Post.findById(postId);
      console.log(post);
      if (!post) {
        const error = new Error("The post not found!");
        error.statusCode = constants.HTTP_NOT_FOUND;
        throw error;
      }

      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;

      return post.save();
    } catch (err) {
      throw err;
    }
  }

  async deletePost(postId) {
    try {
      console.log(postId);
      const post = await Post.findById(postId);
      console.log(post);
      if (!post) {
        const error = new Error("The post not found!");
        error.statusCode = constants.HTTP_NOT_FOUND;
        throw error;
      }

      return Post.findByIdAndRemove(postId);
    } catch (err) {
      throw err;
    }
  }
}

class MongoAuthUtil {
  async createUser(userData) {
    const { name, email, password } = userData;

    const user = new User({
      name,
      email,
      password,
    });

    try {
      const result = await user.save();
      return Promise.resolve(result);
    } catch (err) {
      throw err;
    }
  }

  getUser(userData) {
    const { email, password } = userData;
    return User.findOne({ email });
  }
}

exports.getModels = () => {
  return {
    Post: new MongoPostUtil(),
    Auth: new MongoAuthUtil(),
  };
};
