// use multer middleware to upload image file to backend for remove bg with help of api
const multer =require('multer');

const storage =multer.diskStorage({
    filename : function(req, file , callback){
        callback(null, `${Date.now}_${file.originalname}` ); // null , new uploaded file name
    }
}) ;

const upload = multer({storage});
module.exports =upload;