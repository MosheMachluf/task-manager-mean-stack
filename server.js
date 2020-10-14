const express = require("express");
const app = express();
const mongoose = require("./db/mongoose");
const cors = require("cors");
const path = require("path");
const authenticate = require("./middlewares/authenticate");

/* ROUTES */
const listsRoutes = require("./routes/lists.js");
const usersRoutes = require("./routes/users.js");

/* MIDDLEWARES */

// app.use(cors());
// app.use((req, res, next) => {
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id"
//   );
//   res.header(
//     "Access-Control-Expose-Headers",
//     "x-access-token, x-refresh-token"
//   );
//   next();
// });

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE"
//   );
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id"
//   );

//   res.header(
//     "Access-Control-Expose-Headers",
//     "x-access-token, x-refresh-token"
//   );

//   next();
// });

app.use(express.json());

app.use("/api/lists", authenticate, listsRoutes);
app.use("/api/users", usersRoutes);

// app.use((req, res) => {
//   res.status(404).send("404 - Page Not Found");
// });

  app.use(express.static(path.join(__dirname, "client/dist/client")));
   
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client/dist/client", "index.html"));
  });

/* END MIDDLEWARES */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server run on port ${PORT}`));
