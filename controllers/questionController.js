const mongoose = require("mongoose");
const questionModel = require("../models/question");
const quizModel = require("../models/quiz");
const  userModel = require("../models/user");


exports.getAll = function(req,res){
    questionModel.find()
    .exec()
    .then(questions=>{
        if(questions.length>0){
            return res.status(200).json(questions);
        }
        else {
            return res.status(200).json({message:'questions not found'});
        }
    })
    .catch(err=>{
        return res.status(500).json(err);
    })

}

exports.getQuestionsByquiz = function(req,res){
    questionModel.find({quiz:req.params.idquizd})
    .exec()
    .then(questions=>{
        if(questions.length>0){
            return res.status(200).json(questions);
        }
        else {
            return res.status(200).json({message:'questions not found'});
        }
    })
    .catch(err=>{
        return res.status(500).json(err);
    })
}

exports.getQuestion = function(req,res){
    questionModel.findById(req.params.idquestion)
    .exec()
    .then(question=>{
        if(question){
            return res.status(200).json(question);
        }
        else {
            return res.status(404).json({message:'question not found'})
        }
    })
    .catch(err=>{
        return res.status(500).json(err);
    })
}



exports.create =async function(req,res){
    const quiz = await quizModel.findById(req.params.idquiz);
    const question = new questionModel({
        question: req.body.question,
        reponses:req.body.reponses,
        correctReponse:req.body.correctReponse,
        quiz:quiz._id
    })
    question.save().then(questionSaved=>{
        if(questionSaved){
            quiz.update({questions:questionSaved}).then(quiz=>{
                if(quiz){
                    return res.status(201).json({message:'question created',questionSaved})
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

exports.answerQuestion=function(req,res){
    questionModel.findOne({quiz:req.params.idquiz})
    .exec()
    .then( async question=>{
        if(question){
            if(question.correctReponse.toString() === req.body.answer.toString())
            {
                 const employee= await userModel.findById(req.params.iduser);
                 employee.scores.map(score=>{
                    if(score.quiz==question.quiz){
                        
                        if(score.questionsAnswered !=null){
                            if(score.questionsAnswered.indexOf(question._id)!=-1)
                            {
                                return res.status(403).json({message:'question answered u cannot re-answer'});
                            }
                        }
                        else {
                            score.questionsAnswered=[]
                            score.score+=1;
                            score.questionsAnswered.push(question._id);
                        }
                    }
                })
                employee.save().then(employee=>{
                    if(employee){
                        return res.status(200).json({message:'question answered ! ',employee})
                    }
                    else {
                        return res.status(400).json({message:'question not answered !'});
                    }
                }).catch(err=>{
                    return res.status(500).json(err);
                })
            }
        }
    })
    .catch(err=>{
        return res.status(500).json(err)
    })
}
exports.deleteQuestion = function(req,res){
    questionModel.findByIdAndDelete(req.params.idquestion).exec()
    .then( async questionDeleted=>{
        if(questionDeleted){
            const employees = await userModel.find({'scores.questionsAnswered':{$contains:questionDeleted._id}});
           console.log(employees);
            quizModel.findByIdAndUpdate(questionDeleted.quiz,{$pull:{questions:questionDeleted._id}}).exec()
            .then(quiz=>{
                if(quiz){
                    return res.status(200).json({message:'question deleted'});
                }
                else {
                    return res.status(400).json({message:'a problem has occured'});
                }
            })
            .catch(err=>{
                return res.status(500).json(err);
            })
        }
    })
    .catch(err=>{
        return res.status(500).json(err);
    })

}