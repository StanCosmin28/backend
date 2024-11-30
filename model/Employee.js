const mongoose = require("mongoose");
const { stringify } = require("uuid");
const { getEmployeeTasks } = require("../controllers/employeesController");

const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
});
//modeule !== model
module.exports = mongoose.model("Employees", employeeSchema);
