const express = require("express")
const mongoose = require("mongoose")
const morgan = require("morgan");
const cors = require("cors");
const  BodyParser = require("body-parser");

const app = express();


const uri ="mongodb://localhost:27017/hrcompany";
mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

mongoose.connection.on("ok",()=>{console.log("connection done ")});
mongoose.connection.on("err",()=>{console.log("conection error")});



app.use(morgan('tiny'));
app.use(BodyParser.urlencoded({extended:false}))
app.use(BodyParser.json());
app.use(cors());

app.use('/uploads', express.static('uploads'));

const AdminRoute = require("./routes/admin");
const employeeRoute = require("./routes/employee");
const quizRoute = require("./routes/quiz");
const equipeRoute = require("./routes/equipe");
const questionRoute = require("./routes/question");

app.use("/quiz",quizRoute);
app.use("/admin",AdminRoute);
app.use("/employee",employeeRoute);
app.use("/equipe",equipeRoute);
app.use("/question",questionRoute);

app.listen(3000,()=>{
    console.log("server is listenning on 3000")
})