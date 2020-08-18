const quizModel = require("../models/quiz");
const mongoose = require("mongoose");
const userModel = require("../models/user");
const user = require("../models/user");




exports.startQuiz= function(req,res){
    userModel.findById(req.params.iduser).exec()
    .then(async (employee)=>{
        const quiz = await quizModel.findById(req.params.idquiz);
        if(employee.scores.findIndex(score=>{
            return score.quiz == req.params.idquiz
        })==-1 )
        
        {employee.scores.push({quiz:quiz._id,score:0,questionsAnswered:null});
        employee.save().then(employeeSaved=>{
            if(employeeSaved)
            {
                return res.status(200).json("well done you have started the quiz");
            }
        })
    }
    else {
        return res.status(403).json("you  have done this quiz ! you cannot repeat ");

    }
    })
    .catch(err=>{
        return res.status(500).json(err);
    })
}


exports.deleteQuiz= function(req,res)
{
    quizModel.findByIdAndDelete(req.params.id, async (err,quiz)=>{
        if(quiz){
            const employees = await userModel.find({'scores':{$elemMatch: {quiz: quiz._id}}});
            if(employees.length>0){
                employees.forEach(employee=>{
                  employee.scores.splice(
                    employee.scores.findIndex(score=>{
                        return  score.quiz.toString() == req.params.id.toString();}))
                    employee.save().then(employee=>{}).catch(err=>{
                        return res.status(500).json(err);
                    })
                });    
            }
            return res.status(200).json({message:'quiz deleted'});
        }
        if(err){
            return res.status(500).json(err);
        }
        else {
            return res.status(404).json({message:'quiz not found '});
        }
});
}
exports.getAll=function(req,res){
    quizModel.find()
    .exec()
    .then(quizArary=>{
        if(quizArary.length>0){
            return res.status(200).json(quizArary);
        }
        else {
            return res.status(404).json({message:"quiz not found"})
        }
    })
    .catch(err=>{
        return res.status(500).json(err);
    })
}

exports.getQuiz=function(req,res){
    quizModel.findById(req.params.id)
    .exec()
    .then(quiz=>{
        if(quiz){
            return res.status(200).json(quiz);
        }
        else {
            return res.status(404).json({message:"quiz not found ! "});

        }
    })
    .catch(err=>{
        return res.status(500).json(err);
    })
}


exports.create=function(req,res){
const quiz = new quizModel({
    _id:new mongoose.Types.ObjectId(),
    name:req.body.name
})    
quiz.save()
.then(quizSaved=>{if(quizSaved){
    return res.status(201).json({message:"quiz created done !",quizSaved})
}
}).catch(err=>{
    return res.status(500).json(err);
})
}

exports.update = function(req,res){
    quizModel.findByIdAndUpdate(req.params.id,{$set:{name:req.body.name}})
    .exec()
    .then(quiz=>{
        if(quiz){
            return res.status(200).json({message:'quiz updated'});
        }
        else {
            return res.status(400).json({message:'update failed'});
        }
    })
    .catch(err=>{
        return res.status(500).json(err);

    })
}

exports.getQuizScore=function(req,res){
    userModel.findById(req.params.iduser)
    .exec()
    .then(employee=>{
        if(employee){
           return res.send(employee.scores[employee.scores.findIndex(score=>{
                return score.quiz==req.params.idquiz
            })])
        }
        else {
            return res.status(404).json({message:'employee not found'})
        }
    })
    .catch(err=>{
        return res.status(500).json(err)
    })
}