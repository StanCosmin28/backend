const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    completed: false,
  },
});

const employeeSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  tasks: [taskSchema],
});
module.exports = mongoose.model("Employee", employeeSchema);
