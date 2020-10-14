const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/TaskManager", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connected to MongoDB successfuly!");
  })
  .catch(console.log);

module.exports = mongoose;
