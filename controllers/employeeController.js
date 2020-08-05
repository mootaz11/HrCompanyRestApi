const mongoose = require("mongoose");
const userModel = require("../models/user");
const RoleModel = require("../models/role");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getEmployees=function(req,res){
    let  employees=[];
    RoleModel.find({type:"employee"}).exec()
    .then( async roles=>{
        if(roles.length>0){
            for(var i =0;i<roles.length;i++){
                const employee= await userModel.findById(roles[i].user).populate('role');
                console.log(employee)
                employees.push(employee)

            }    
         
            return res.status(200).json(employees)

        }
        else  {
            return res.status(200).json({message:"there is no employees"})
        }
    })
}

exports.deleteEmployee=function(req,res){
    userModel.findByIdAndDelete(req.params.id,(err,result)=>{
        if(result){
            return res.status(200).json({message:'employee deleted'});
        }
        
        if(err){
            return res.status(500).json(err);
        }

        else {
            return res.status(404).json({message:'employee not found '});
        }
        

    })
}

exports.getEmployee=function(req,res){
    userModel.findById(req.params.id).exec()
    .then(employee=>{
        if(employee){
            return res.status(200).json(employee);
        }
        else {
            return res.status(404).json({message:'employee not found'})
        }
    })
    .catch(err=>{
        return res.status(404).json(err);
    })
    
    }
    
    exports.updateInfo = function(req, res) {
        userModel.findById(req.params.id)
            .exec()
            .then(async employee => {
                if (employee) {
                    if(req.body.motdepasse){
                     const  encrypted = await  bcrypt.hash(req.body.motdepasse, 10);
                     employee.motdepasse=encrypted;
                }
    
                if(req.file.path){
                    console.log(req.file.path);
                }
    
    
                Object.keys(req.body).forEach(element=>{
                    if(element.toString() !== "motdepasse"){
                        employee[element]=req.body[element]
                    }
                })
                
                employee.save().then(result=>{
                    if(result){
                        return res.status(200).json({message:'update done ',employee})
                       }
                       else {
                           return res.status(400).json({message:'update failed'});
                       }
                }).catch(err=>{
                    return res.status(500).json(err);
                })
            }
            else {
                return res.status(404).json({message:'employee not found'});
    
            }
        })    
    
            
            .catch(err => {
                return res.status(500).json(err)
            })
    }
    
    
    
    
    exports.login = function (req,res){
        userModel.findOne({ email: req.body.email })
            .exec()
            .then( async  employee => {
                    
                if (employee) {
                    const role =  await RoleModel.findById(employee.role);  
                    if(role.type!="employee"){
                        return res.status(403).json({message:'you are not employee'});
                    }
                    
                    bcrypt.compare(req.body.motdepasse, employee.motdepasse,  (err, same) => {
                        if (err) {
                            return new Error("comparing failed");
                        }
                        if (same) {
                        
                            const token = jwt.sign({employee_id: employee._id ,role:role.type}, "Secret", { expiresIn: 60 * 60 * 60 })
                            return res.status(200).json({ message: 'login successfully', token });
                        } 
                        else
                        {
                            return res.status(401).json({ message: 'mot de passe incorrect' });
                        }
    
                    })
                }  
                else {
                    return res.send("email incorrect")
                } 
            })
            .catch(err => {
                return res.staus(500).json(err);
            });
    }
    
    
    exports.signup =function (req,res){
        console.log()
        userModel.findOne({ email: req.body.email })
        .exec()
        .then(employee => {
        
            if (employee) {
                return res.status(401).json({ message: 'email exists try another one' });
            } else {
                bcrypt.hash(req.body.motdepasse, 10, (err, encrypted) => {
                    if (err) {
                        return new Error("crypting error");
                    }
                    if (encrypted) {
    
                        const role = new RoleModel({
                            _id:new mongoose.Types.ObjectId(),
                            type:"employee",
                            user:null
                        })
                        const employee = new userModel({
                            _id: new mongoose.Types.ObjectId(),
                            nom: req.body.nom,
                            prenom: req.body.prenom,
                            motdepasse: encrypted,
                            email: req.body.email,
                            datenaissance:req.body.datenaissance,
                            role: role,
                            image:req.files.image[0].path,
                            cv:req.files.cv[0].path,
                            roleType:role.type
                        })
                        employee.save()
                            .then(  employee => {
                                if (employee) {      
                                   role.user=employee._id;
                                    role.save().then(roleSaved=>{                          
                                    return res.status(201).json({ message: 'employee created', employee });
                                }).catch(err=>{
                                    return res.status(500).json(err);
                                })
                                }
                            })
                            .catch(err => {
                                return res.status(500).json(err);
                            })
                    }
                })
            }
        })
        .catch(err => {
            return res.status(500).json(err);
    
        })
    
    }
    
    