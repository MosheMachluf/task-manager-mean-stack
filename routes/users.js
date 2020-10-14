const express = require("express");
const router = express.Router();
const verifySession = require("../middlewares/auth");
const User = require("../models/user-model");

router.post("/", async (req, res) => {
  // User signup
  let body = req.body;
  let newUser = new User(body);
  try {
    await newUser.save();
    let refreshToken = await newUser.createSession();
    let accessToken = await newUser.generateAccessAuthToken();
    let authTokens = { accessToken, refreshToken };
    res
      .header("x-refresh-token", authTokens.refreshToken)
      .header("x-access-token", authTokens.accessToken)
      .send(newUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findByCredentials(email, password);
    let refreshToken = await user.createSession();
    let accessToken = await user.generateAccessAuthToken();

    let authTokens = { accessToken, refreshToken };
    res
      .header("x-refresh-token", authTokens.refreshToken)
      .header("x-access-token", authTokens.accessToken)
      .send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/me/access-token", verifySession, async (req, res) => {
  try {
    let accessToken = await req.userObject.generateAccessAuthToken();
    res.header("x-access-token", accessToken).send({ accessToken });
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
