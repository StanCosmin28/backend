const Employee = require("../model/Employee");

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find();
  if (!employees) return res.status(204).json({ message: "No Employees" });
  res.json(employees);
};

const createNewEmployee = async (req, res) => {
  if (!req.body?.firstname || !req.body?.lastname) {
    return res
      .status(400)
      .json({ message: "First and last name are required" });
  }
  try {
    const tasks =
      req.body.tasks?.map((task, index) => ({
        id: index + 1,
        description: task.description,
        completed: task.completed || false,
      })) || [];

    const result = await Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      tasks: tasks,
    });

    res.json(result);
  } catch (err) {
    console.error(err);
  }
};

const updateEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "User not found" });
  }

  const employee = await Employee.findOne({ _id: req.body.id });
  if (!employee) return res.status(204).json({ message: "No employee" });

  if (req.body?.firstname) employee.firstname = req.body.firstname;
  if (req.body?.lastname) employee.lastname = req.body.lastname;
  if (req.body?.tasks) {
    const updatedTasks = employee.body.tasks.map((task) => {
      const updatedTask = req.body.tasks.find((t) => t.id === task.id);
      return updatedTask ? { ...task, ...updatedTask } : task;
    });
    employee.tasks = updatedTasks;
  }
  const result = await employee.save(); // save the employee we found, not the entire Employees Model!!!
  res.json(result);
};

const deleteEmployee = async (req, res) => {
  if (!req.employee?.id) return res.status(400).json({ message: "Not found" });

  const employee = await Employee.findOne({ _id: req.body.id }).exec();

  if (!employee) return res.status(400).json({ message: "Not found" });

  const result = await employee.deleteOne({ _id: req.body.id });
  res.json(result);
};

const getEmployee = async (req, res) => {
  if (!req?.params?.id) return res.status(400).json({ message: "Not found" });

  const employee = await Employee.findOne({ _id: req.params.id });
  if (!employee) {
    return res.satus(400).json({ message: "Not found" });
  }
  res.json(employee);
};

const getEmployeeTasks = async (req, res) => {
  if (!req.params?.id) return res.status(400).json({ message: "Not found" });

  const employee = await Employee.findOne({ _id: req.params.id });
  if (!employee) return res.status(400).json({ message: "Not found" });
  const tasks = [...employee.tasks];
  res.json(tasks);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
  getEmployeeTasks,
};
