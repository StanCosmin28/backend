const express = require("express");
const router = express.Router();
const employeesController = require("../../controllers/employeesController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .get(employeesController.getAllEmployees)
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    employeesController.createNewEmployee
  )
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    employeesController.updateEmployee
  )
  .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee);

router.delete(
  "/:id",
  verifyRoles(ROLES_LIST.Admin),
  employeesController.deleteEmployeeTask
);
router.post(
  "/:id/tasks",
  verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
  employeesController.addEmployeeTask
);
router.put(
  "/:id/tasks/:taskId",
  verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
  employeesController.updateEmployeeTask
);

module.exports = router;
