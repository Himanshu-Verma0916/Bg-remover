const mongoose =require('mongoose');

const connectDb = async()=>{
    mongoose.connection.on('connected',()=>{
        console.log('Database connected successfully');
    })
    mongoose.connect(`${process.env.MONGO_URI}/Bg-remover`)
}

module.exports = connectDb;