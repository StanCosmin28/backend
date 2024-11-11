const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("TODO APP");
});

const tasksRouter = require("./routes/tasks");

app.use("/tasks", tasksRouter);

app.listen(PORT);
