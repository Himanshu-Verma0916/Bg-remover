const User = require('../model/userModel');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data'); // for taking input image from frontend to backend (we will use multer middleware)
const { messageInRaw } = require('svix');
require('dotenv').config();

// API controller function to remove background from image
// https://localhost:5000/api/images/remove-bg

const removeBgImage = async (req, res) => {
    try {
        const { clerkId } = req.user; // it take body from clerkHook session via authUser middleware 
        
        console.log("🟢 Clerk ID from req.user:", req.user?.clerkId);
        const user = await User.findOne({ clerkId });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.creditBalance === 0) {
            return res.json({ success: false, creditBalance: user.creditBalance, message: 'No credit balance', creditBalance: user.creditBalance });
        }

        // if user has creditbalance ...
        const imagePath = req.file.path;
        // reading image file
        const imageFile = fs.createReadStream(imagePath);

        //  although for using clipdrop api the image file should be in form data
        const formData = new FormData();
        formData.append('image_file', imageFile);   // form data is ready

        // calling clippath api to remove bg of image (read clippath docs to call api)
        const { data } = await axios.post('https://clipdrop-api.co/remove-background/v1', formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API_KEY,
                ...formData.getHeaders(),
            },
            responseType: 'arraybuffer'
        })

        // now we have to send response data to frontend , so we create base 64 image
        const base64Image = Buffer.from(data, 'binary').toString('base64');
        const resultImage = `data:${req.file.mimetype};base64,${base64Image}`; // image is created
        //before sending result image to  user ,deduct 1 credit point

        // await User.findByIdAndUpdate(user._id, {creditBalance:user.creditBalance -1 });
        // res.json({success:true , resultImage, creditBalance: user.creditBalance -1 , message : "background removed"});

        // Deduct 1 credit safely
        const updatedUser = await User.findByIdAndUpdate(user._id, { $inc: { creditBalance: -1 } }, { new: true });

        res.json({ success: true, resultImage, creditBalance: updatedUser.creditBalance, message: "Background removed successfully", });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

module.exports = { removeBgImage };

