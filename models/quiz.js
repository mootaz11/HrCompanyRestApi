const mongoose = require("mongoose")


const quizSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:String,
    questions:[{type:mongoose.Schema.Types.ObjectId,default:null,ref:'question'}]
});


module.exports=mongoose.model("quiz",quizSchema);