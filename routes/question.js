const route = require("express").Router()
const questionController = require("../controllers/questionController");



route.post("/create/:idquiz",questionController.create);
route.post("/update/:id");
route.get("/getQuestion/:idquestion",questionController.getQuestion);
route.get("/getAll",questionController.getAll);
route.get("/getquestionsByquiz/:idquiz",questionController.getQuestionsByquiz)
route.delete("/delete/:id",questionController.deleteQuestion);
route.post("/answerQuestion/:iduser/:idquiz",questionController.answerQuestion);





module.exports=route;