const route = require("express").Router()
const AdminController = require("../controllers/AdminController");
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
  ),AdminController.signup);

route.post("/login",AdminController.login);
route.post("/update/:id",AdminController.updateInfo);
route.get("/getAdmin/:id",AdminController.getAdmin);

module.exports=route;