require('dotenv').config();
const cors = require('cors');
const express = require('express');
const connectDb = require('./config/mongodb');
const userRouter = require('./routes/userRoute');
const bodyParser = require("body-parser");
const imageRouter = require('./routes/imageRoute');

// connect to database
connectDb();
// app config
const PORT = process.env.PORT || 5000;
const app = express();


// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("API working fine");
});

app.use('/api/users', userRouter);
app.use('/api/images' ,imageRouter);

// Listen only when running locally
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
// app.listen(PORT, (err)=>{
//     if(!err){
//         console.log(`Server is running on ${PORT}`);
//     }
// })

module.exports = app;
