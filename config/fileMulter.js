const multer = require("multer");


const storage = multer.diskStorage({
    destination:function(req,file,cb){
        if(file.fieldname==="image"){
            cb(null,'uploads/images/');

        }
        else {
            cb(null,'uploads/cv/');
        }
    },
    filename:function(req,file,cb){
        cb(null, Date.now()+file.originalname);
    }
});

const fileFilter=function(req,file,cb){

    if(file.fieldname ==="cv"){
        if(file.mimetype==='application/pdf')
        {         
    
             cb(null,true);
        }
        else {
            cb(null,false,new Error('type doesn\'t exists')); 
    
        }
    }

    if(file.fieldname ==="image"){
        if(file.mimetype==='image/jpeg' || file.mimetype==='image/png' || file.mimetype==='image/pjpeg'){
            cb(null,true);
       }
       else {
           cb(null,false,new Error('type doesn\'t exists')); 
   
       }
    }
   
}

const upload = multer({storage:storage,
    fileLimits:{fileSize:1024*1024*5},
    fileFilter:fileFilter})

module.exports=upload;
