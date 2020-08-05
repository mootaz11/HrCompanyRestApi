const mongoose = require("mongoose");
const EquipeModel = require("../models/equipe");
const UserModel = require("../models/user");



exports.addEmployeeToEquipe=function(req,res){
    UserModel.findById(req.params.employeeId).exec()
    .then(async employee=>{
        if(employee.roleType=="employee"){
            const equipe = await EquipeModel.findByIdAndUpdate(req.params.equipeId,{$push:{employees:employee}})
            employee.equipe=equipe._id;
            return res.status(200).json("employee added");
        }
        else {
            return res.status(400).json("employee not added");
        }
    })
    .catch(err=>{
        return res.status(500).json(err);
    })
    
    }






exports.getAll= function(req,res){
    EquipeModel.find()
    .exec()
    .then(equipe=>{
        if(equipe.length>0){
            return res.status(200).json(equipe);
        }
        else {
            return res.status(404).json({message:"equipe not found"})
        }
    })
    .catch(err=>{
        return res.status(500).json(err);
    })

}



exports.getequipe=function(req,res){
    EquipeModel.findById(req.params.id)
    .exec()
    .then(equipe=>{
        if(equipe){
            return res.status(200).json(equipe);
        }
        else {
            return res.status(404).json({message:"equipe not found ! "});

        }
    })
    .catch(err=>{
        return res.status(500).json(err);
    })
}


exports.create=function(req,res){
    const equipe = new EquipeModel({
        _id: new mongoose.Types.ObjectId(),
        name:req.body.name
    })
    equipe.save()
    .then(equipeSaved=>{
        if(equipeSaved){
            return res.status(201).json({message:'equipe created'});
                }
    })
    .catch(err=>{
        return res.status(500).json(err);
    })
}

exports.update=function(req,res){
EquipeModel.findById(req.params.id)
.exec()
.then(result=>{
    if(result){
        if(req.body.teamLeader){
            result.teamLeader=req.body.teamLeader;
        }
        if(req.body.name){
            result.name=req.body.name;
        }
        result.save()
        .then(saved=>{
            if(saved){
                return res.status(200).json("equipe updated");
            }
        }).catch(err=>{
            return res.status(500).json(err);
        })
    }
})
.catch(err=>{
    return res.status(500).json(err);
})
}

exports.delete=function(req,res){
EquipeModel.findByIdAndRemove(req.params.id)
.exec()
.then(async equipe=>{
    if(equipe){
        if(equipe.employees.length>0){
            for(var i =0 ;i<equipe.employees.length;i++){
                    const userUpdated =  await UserModel.findByIdAndUpdate(equipe.employees[i],{$set:{equipe:null}})
            }
        }
        return res.status(200).json("equipe deleted");
    }
    else {
        return res.status(400).json("something went wrong");
    }

}).catch(err=>{
    return res.status(500).json(err);

})
    
}