const express = require("express");
const router = express.Router();
const List = require("../models/list-model");
const Task = require("../models/task-model");

router.get("/", async (req, res) => {
  try {
    let lists = await List.find({ _userId: req.user_id });
    res.send(lists);
  } catch (err) {
    res.send(err);
  }
});

router.post("/", async (req, res) => {
  const { title } = req.body;
  let newList = new List({ title, _userId: req.user_id });
  await newList.save();
  res.send(newList);
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  let list = await List.findOneAndUpdate(
    { _id: id, _userId: req.user_id },
    { $set: req.body }
  );
  res.json({ message: `List ${id} updated successfully!`, list });
});

const deleteTasksFromList = async (_listId) => {
  await Task.deleteMany({ _listId });
  console.log(`Tasks from ${_listId} were deleted!`);
};

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  let list = await List.findOneAndRemove({ _id: id, _userId: req.user_id });
  res.json({ message: `List ${id} Deleted`, list });
  deleteTasksFromList(list._id);
});

// Get all tasks in a specific list
router.get("/:id/tasks", async (req, res) => {
  const { id } = req.params;
  let tasks = await Task.find({ _listId: id });
  res.send(tasks);
});

router.get("/:id/tasks/:taskId", async (req, res) => {
  const { id, taskId } = req.params;
  let task = await Task.findOne({ _id: taskId, _listId: id });
  res.send(task);
});

router.post("/:id/tasks", async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  let list = await List.findOne({ _id: req.params.id, _userId: req.user_id });
  if (!list) return res.sendStatus(404);

  let newTask = new Task({ title, _listId: id });
  await newTask.save();
  res.send(newTask);
});

router.patch("/:id/tasks/:taskId", async (req, res) => {
  const { id, taskId } = req.params;

  let list = await List.findOne({ _id: id, _userId: req.user_id });
  if (!list) return res.sendStatus(404);

  let task = await Task.findOneAndUpdate(
    { _id: taskId, _listId: id },
    { $set: req.body }
  );

  res.json({ message: `Task ${taskId} updated successfully!`, task });
});

router.delete("/:id/tasks/:taskId", async (req, res) => {
  const { id, taskId } = req.params;

  let list = await List.findOne({ _id: req.params.id, _userId: req.user_id });

  if (!list) return res.sendStatus(404);

  let task = await Task.findOneAndRemove({ _id: taskId, _listId: id });
  if (!task) return res.sendStatus(404);

  res.json({ message: `Task ${id} Deleted`, task });
});

module.exports = router;
