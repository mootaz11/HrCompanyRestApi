const mongoose = require("mongoose");


const questionSchema = new mongoose.Schema({
    question:String,
    reponses:[{reponse:String}],
    correctReponse:String,
    quiz:{type:mongoose.Schema.Types.ObjectId,ref:'quiz'},
})

module.exports=mongoose.model("question",questionSchema);
