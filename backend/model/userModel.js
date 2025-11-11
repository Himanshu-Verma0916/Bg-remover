const mongoose =require('mongoose');

const userSchema = new mongoose.Schema({
    clerkId: { type:String , required:true, unique: true},
    email: { type:String , unique: true},
    photo: { type:String },
    firstName: { type:String},
    lastName: { type:String },
    creditBalance: { type:Number ,default:5},
});

const User =mongoose.model('user', userSchema);
module.exports=User;