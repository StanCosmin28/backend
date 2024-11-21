const express = require("express");
const fs = require("fs");
const filePath = "./tasks.json";
const router = express.Router();

router.use(express.json());

function getTasks() {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

function saveTasks(tasks) {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

router.get("/", (req, res) => {
  const tasks = getTasks();
  console.log(tasks);
  res.json(tasks);
});

router.post("/", (req, res) => {
  const tasks = getTasks();
  const newTask = {
    id: tasks.length + 1,
    description: req.body.description,
    completed: false,
  };
  tasks.push(newTask);
  saveTasks(tasks);
  res.json(newTask);
});

router.patch("/:id", (req, res) => {
  const tasks = getTasks();
  const taskId = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    task.completed = true;
    saveTasks(tasks);
    res.json(task);
  } else {
    res.status(404).json({ error: "task not found" });
  }
});

router.put("/:id", (req, res) => {
  const tasks = getTasks();
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    res.status(404).json({ error: "Task Not Found!" });
    return;
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    description: req.body.description || tasks[taskIndex].description,
    completed: req.body.completed ?? tasks[taskIndex].completed,
  };

  saveTasks(tasks);
  res.json(tasks[taskIndex]);
});

router.delete("/:id", (req, res) => {
  const tasks = getTasks();
  const taskId = parseInt(req.params.id);
  const updatedTasks = tasks.filter((task) => task.id !== taskId);
  if (tasks.length === updatedTasks.length) {
    res.status(404).json({ error: "Task Not Found!" });
  } else {
    saveTasks(updatedTasks);
    res.status(204).send();
  }
});

module.exports = router;
