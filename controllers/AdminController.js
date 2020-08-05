const mongoose = require("mongoose");
const userModel = require("../models/user");
const RoleModel = require("../models/role");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.getAdmin=function(req,res){
userModel.findById(req.params.id).exec()
.then(admin=>{
    if(admin){
        return res.status(200).json(admin);
    }
    else {
        return res.status(404).json({message:'admin not found'})
    }
})
.catch(err=>{
    return res.status(404).json(err);
})

}

exports.updateInfo = function(req, res) {
    userModel.findById(req.params.id)
        .exec()
        .then(async admin => {
            if (admin) {
                if(req.body.motdepasse){
                 const  encrypted = await  bcrypt.hash(req.body.motdepasse, 10);
                 admin.motdepasse=encrypted;
            }

            if(req.file.path){
                console.log(req.file.path);
            }


            Object.keys(req.body).forEach(element=>{
                if(element.toString() !== "motdepasse"){
                    admin[element]=req.body[element]
                }
            })
            
            admin.save().then(result=>{
                if(result){
                    return res.status(200).json({message:'update done ',admin})
                   }
                   else {
                       return res.status(400).json({message:'update failed'});
                   }
            }).catch(err=>{
                return res.status(500).json(err);
            })
        }
        else {
            return res.status(404).json({message:'admin not found'});

        }
    })    

        
        .catch(err => {
            return res.status(500).json(err)
        })
}




exports.login = function (req,res){
    userModel.findOne({ email: req.body.email })
        .exec()
        .then( async admin => {

            if (admin) {
                const role =  await RoleModel.findById(admin.role);  
                if(role.type!="admin"){
                    return res.status(403).json({message:'you are not admin'});
                }
                
                bcrypt.compare(req.body.motdepasse, admin.motdepasse, (err, same) => {
                    if (err) {
                        return new Error("comparing failed");
                    }
                    if (same) {

                        const token = jwt.sign({admin_id: admin._id }, "Secret", { expiresIn: 60 * 60 * 60 })
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
    .then(admin => {
    
        if (admin) {
            return res.status(401).json({ message: 'email exists try another one' });
        } else {
            bcrypt.hash(req.body.motdepasse, 10, (err, encrypted) => {
                if (err) {
                    return new Error("crypting error");
                }
                if (encrypted) {

                    const role = new RoleModel({
                        _id:new mongoose.Types.ObjectId(),
                        type:"admin",
                        user:null
                    })
                    const admin = new userModel({
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
                    admin.save()
                        .then(  admin => {
                            if (admin) {      
                               role.user=admin._id;
                                role.save().then(roleSaved=>{                          
                                return res.status(201).json({ message: 'Admin created', admin });
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

