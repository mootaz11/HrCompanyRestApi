const route = require("express").Router()
const equipeController = require("../controllers/equipeController");


route.post("/create",equipeController.create);
route.post("/update/:id",equipeController.update);
route.get("/getEquipe/:id",equipeController.getequipe);
route.get("/getAll",equipeController.getAll);
route.delete("/delete/:id",equipeController.delete);
route.post("/addEmployeeToEquipe/:employeeId/:equipeId",equipeController.addEmployeeToEquipe)


module.exports=route;