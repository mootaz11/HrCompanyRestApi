const mongoose = require("mongoose");


const roleSchema = new mongoose.Schema({
_id:mongoose.Schema.Types.ObjectId,

    type:{
        type:String,
        enum:["admin","employee"]
        },
    user:{type:mongoose.Schema.Types.ObjectId,ref:'user'}


})

module.exports= mongoose.model("role",roleSchema);
