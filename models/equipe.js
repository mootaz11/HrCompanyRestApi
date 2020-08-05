const mongoose = require("mongoose");


const equipeSchema = new mongoose.Schema({
_id:mongoose.Schema.Types.ObjectId,
name:String,
teamLeader:mongoose.Schema.Types.ObjectId,
employees:[{type:mongoose.Schema.Types.ObjectId,default:null,ref:'user'}]
})


module.exports=mongoose.model("equipe",equipeSchema);