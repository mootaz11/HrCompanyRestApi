const route = require("express").Router()
const quizController = require("../controllers/quizController");



route.post("/create",quizController.create);
route.post("/update/:id",quizController.update);
route.get("/getQuiz/:id",quizController.getQuiz);
route.get("/getAll",quizController.getAll);
route.get("/delete/:id",quizController.deleteQuiz);
route.post("/startQuiz/:iduser/:idquiz",quizController.startQuiz);



module.exports=route;