const Employee = require("../model/Employee");

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find();
  if (!employees) return res.status(204).json({ message: "No Employees" });
  // const roles = req.roles;

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
const test = "this is a test for me ";

const updateEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "User not found" });
  }

  const employee = await Employee.findOne({ _id: req.body.id });
  if (!employee) return res.status(204).json({ message: "No employee" });

  if (req.body?.firstname) employee.firstname = req.body.firstname;
  if (req.body?.lastname) employee.lastname = req.body.lastname;
  if (req.body?.tasks) {
    if (!Array.isArray(req.body.tasks)) {
      return res.status(400).json({ message: "Tasks should be an array" });
    }

    if (req.body?.tasks && Array.isArray(req.body.tasks)) {
      req.body.tasks.forEach((newTask) => {
        const existingTaskIndex = employee.tasks.findIndex((task) => {
          return task.description === newTask.description;
        });

        if (existingTaskIndex !== -1) {
          console.log("existing task");
          employee.tasks[existingTaskIndex] = {
            ...employee.tasks[existingTaskIndex],
            ...newTask,
          };
        } else {
          console.log("new task");
          employee.tasks.push(newTask);
        }
      });
    }
  }

  const result = await employee.save();
  res.json(result);
};

const deleteEmployee = async (req, res) => {
  if (!req.body?.id) return res.status(400).json({ message: "Not found" });

  const employee = await Employee.findOne({ _id: req.body.id }).exec();

  if (!employee) return res.status(400).json({ message: "Not found" });

  const result = await employee.deleteOne({ _id: req.body.id });
  res.json(result);
};

const deleteEmployeeTask = async (req, res) => {
  const { employeeId, taskId } = req.body;

  if (!employeeId || !taskId) {
    return res
      .status(400)
      .json({ message: "Employee ID and Task ID are required" });
  }

  try {
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const taskIndex = employee.tasks.findIndex(
      (task) => task._id.toString() === taskId
    );
    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found" });
    }

    employee.tasks.splice(taskIndex, 1);

    await employee.save();

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

const addEmployeeTask = async (req, res) => {
  const { id } = req.params;
  const { task } = req.body;

  if (!id || !task || !task.description) {
    return res.status(400).json({
      message: "Employee ID and task description are required",
    });
  }

  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    const newTask = {
      description: task.description,
      completed: false,
    };

    employee.tasks.push(newTask);
    await employee.save();

    res.status(201).json(newTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred." });
  }
};

const updateEmployeeTask = async (req, res) => {
  const { id, taskId } = req.params;
  const { task } = req.body;

  if (!id || !taskId) {
    return res.status(400).json({
      message: "Employee ID and Task ID are required",
    });
  }

  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    const taskIndex = employee.tasks.findIndex(
      (t) => t._id.toString() === taskId
    );
    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found." });
    }

    employee.tasks[taskIndex] = { ...employee.tasks[taskIndex], ...task };
    await employee.save();

    res.status(200).json(employee.tasks[taskIndex]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred." });
  }
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

const getEmployeeTaskData = async (req, res) => {
  const test = await Employee.findOne({ _id: req.body.id });
  // console.log(req.body, test);
  res.json(req.body, test);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  updateEmployeeTask,
  deleteEmployee,
  deleteEmployeeTask,
  getEmployee,
  getEmployeeTasks,
  getEmployeeTaskData,
  addEmployeeTask,
};
