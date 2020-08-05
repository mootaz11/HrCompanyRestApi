const route = require("express").Router()
const employeeController = require("../controllers/employeeController");
const multer = require("../config/fileMulter");

route.post("/register",multer.fields(
    [
      { 
        name: 'cv', 
        maxCount: 1 
      }, 
      { 
        name: 'image', 
        maxCount: 1 
      }
    ]
  ),employeeController.signup);
route.post("/login",employeeController.login);
route.post("/update",employeeController.updateInfo);
route.get("/getEmployee/:id",employeeController.getEmployee);
route.get("/getAll",employeeController.getEmployees);
route.delete("/delete/:id",employeeController.deleteEmployee);

module.exports = route;