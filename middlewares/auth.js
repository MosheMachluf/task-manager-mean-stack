const User = require("../models/user-model");

const verifySession = (req, res, next) => {
  let refreshToken = req.header("x-refresh-token");
  let _id = req.header("_id");

  User.findByIdAndToken(_id, refreshToken)
    .then((user) => {
      if (!user) {
        return Promise.reject({
          error:
            "User not found. Make sure that the refresh token and user id are correct",
        });
      }

      req.user_id = user._id;
      req.userObject = user;
      req.refreshToken = refreshToken;

      let isSessionValid = false;

      user.sessions.forEach((session) => {
        if (session.token === refreshToken) {
          if (!User.hasRefreshTokenExpired(session.expiresAt)) {
            isSessionValid = true;
          }

          if (isSessionValid) next();
          else
            return Promise.reject({
              error: "Refresh token has expired or the session is invalid",
            });
        }
      });
    })
    .catch((err) => res.status(401).send(err));
};

module.exports = verifySession;

// const User = require("../models/user-model");

// const verifySession = async (req, res, next) => {
//   try {
//     let refreshToken = req.header("x-refresh-token");
//     let _id = req.header("_id");
//     let user = await User.findByIdAndToken(_id, refreshToken);
//     console.log(user);
//     if (!user)
//       return Promise.reject({
//         error:
//           "User not found. Make sure that the refresh token and user id are correct",
//       });

//     req.user_id = user._id;
//     req.userObject = user;
//     req.refreshToken = refreshToken;

//     let isSessionValid = false;

//     user.sessions.forEach((session) => {
//       if (session.token === refreshToken) {
//         if (!User.hasRefreshTokenExpired(session.expiresAt)) {
//           isSessionValid = true;
//         }

//         if (isSessionValid) next();
//         else
//           return Promise.reject({
//             error: "Refresh token has expired or the session is invalid",
//           });
//       }
//     });
//   } catch (err) {
//     return res.status(401).send(err);
//   }
// };

// module.exports = verifySession;
