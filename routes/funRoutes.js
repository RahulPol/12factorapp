const express = require("express");

const funController = require("../controllers/funController");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/jokeoftheday", isAuth, funController.jokeOfTheDay);

module.exports = router;
