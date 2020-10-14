const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

const authenticate = (req, res, next) => {
  let token = req.header("x-access-token");

  jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
    if (err) return res.status(401).send(err);
    else req.user_id = decoded._id;
    next();
  });
};

module.exports = authenticate;
