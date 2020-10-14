const mongoose = require("mongoose");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const jwtSecret = "6d2f7sfEL7Asf7dD8as8j0Oio2kdS2D7";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 5,
    trim: true,
    unique: true,
  },
  password: { type: String, required: true, minlength: 8 },
  sessions: [
    {
      token: { type: String, required: true },
      expiresAt: { type: Number, required: true },
    },
  ],
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  return _.omit(userObject, ["password", "sessions"]);
};

userSchema.methods.generateAccessAuthToken = function () {
  const user = this;
  return new Promise((resolve, reject) => {
    jwt.sign(
      { _id: user._id.toHexString() },
      jwtSecret,
      { expiresIn: "15m" },
      (err, token) => {
        if (!err) resolve(token);
        else reject(err);
      }
    );
  });
};

userSchema.methods.generateRefreshAuthToken = function () {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(64, (err, buffer) => {
      if (!err) {
        let token = buffer.toString("hex");
        return resolve(token);
      }
    });
  });
};

userSchema.methods.createSession = async function () {
  let user = this;

  try {
    let generateToken = await user.generateRefreshAuthToken();
    let refreshToken = await saveSessionToDatabase(user, generateToken);
    return refreshToken;
  } catch (err) {
    Promise.reject("Failed to save session to database. \n" + err);
  }
};

/* MODEL METHODS (static methods) */

userSchema.statics.getJWTSecret = () => {
  return jwtSecret;
};

userSchema.statics.findByIdAndToken = function (_id, token) {
  const User = this;

  return User.findOne({ _id, "sessions.token": token });
};

userSchema.statics.findByCredentials = async function (email, password) {
  const User = this;

  let user = await User.findOne({ email });
  if (!user) return Promise.reject();

  return new Promise(async (resolve, reject) => {
    let res = await bcrypt.compare(password, user.password);
    if (res) resolve(user);
    else reject();
  });
};

userSchema.statics.hasRefreshTokenExpired = (expiresAt) => {
  let secondsSinceEpoch = Date.now() / 1000;

  //hasn't expired
  if (expiresAt > secondsSinceEpoch) return false;
  //has expired
  else return true;
};

/* MIDDLEWARE */
// Before a user document is saved, this code runs

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    // if the password field has been edited / changed then run this code

    try {
      let hash = await bcrypt.hash(user.password, 10);
      user.password = hash;
    } catch (err) {
      console.log(err);
    }

    next();
  } else next();
});

/* HELPER METHODS */
const saveSessionToDatabase = (user, refreshToken) => {
  return new Promise(async (resolve, reject) => {
    let expiresAt = generateRefreshTokenExpiryTime();
    user.sessions.push({ token: refreshToken, expiresAt });

    try {
      await user.save();
      return resolve(refreshToken);
    } catch (err) {
      reject(err);
    }
  });
};

const generateRefreshTokenExpiryTime = () => {
  let daysUntilExpire = "10";
  let secondsUntilExpire = daysUntilExpire * 24 * 60 * 60;
  return Date.now() / 1000 + secondsUntilExpire;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
