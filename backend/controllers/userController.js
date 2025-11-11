// we put user data when user sign up or login using clerk
// with help of clerkweb hooks
const { Webhook, messageInRaw } = require('svix');
const User = require('../model/userModel');
require('dotenv').config();
const Stripe = require('stripe');
const transactionModel = require('../model/transactionModel');

// API controller function to mange Clerk User with database
// https://localhost:5000/api/users/webhooks 

const clerkWebHooks = async (req, res) => {
    try {
        // create a svix instance with clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });

        const { data, type } = req.body; // ✅ Clerk verified event
        console.log("🟢 Verified event:", type);
        console.log("data:", data);

        switch (type) {
            case "user.created":
                // create new user in database
                const newUser = {
                    clerkId: data.id,
                    email: data.email_addresses?.[0]?.email_address || `no-email-${data.id}@clerk.com`,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url
                };
                await User.create(newUser);
                res.json({ success: true, message: "User created successfully" });
                break;

            case "user.deleted":
                // delete user from database
                await User.findOneAndDelete({ clerkId: data.id });
                res.json({ success: true, message: "User deleted successfully" });
                break;

            case "user.updated":
                // update user in database
                const updatedData = {
                    email: data.email_addresses?.[0]?.email_address || `no-email-${data.id}@clerk.com`,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url
                };
                await User.findOneAndUpdate({ clerkId: data.id }, updatedData);
                res.json({ success: true, message: "User updated successfully" });
                break;

            default:
                res.json({ success: true, message: `Unhandled event type: ${type}` });
        }

    } catch (err) {
        console.log(err.message);
        res.json({ success: false, message: err.message });
    }
}

// api controller to get  user available  credits data
const userCredits = async (req, res) => {
    try {
        const { clerkId } = req.user;  // we will not send clerk id from req.body in real scenario, we will get it from auth middleware
        // const { clerkId } = req.body;  // we will not send clerk id from req.body in real scenario, we will get it from auth middleware
        // by auth middleware we will decode jwt token to get clerkId  (getting clerkId from webhook session which we created and by this we get clerk id on header)
        console.log("🟢 Clerk ID received:", clerkId);

        const userData = await User.findOne({ clerkId });
        console.log("🟢 Found user:", userData);

        if (!userData) {
            return res.json({ success: false, message: "User not found in database" });
        }

        res.json({ success: true, credits: userData.creditBalance });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// stripe instance
const stripeInstance = new Stripe(process.env.STRIPE_KEY_SECRET);

// Api to make payment for credits
const paymentStripe = async (req, res) => {
    try {
        if (!req.user || !req.user.clerkId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        const { clerkId } = req.user;
        const { planId } = req.body;
        const userData = await User.findOne({ clerkId });

        if (!userData || !planId) {
            return res.json({ success: false, message: "Invalid Credential" });
        }

        let credits, plan, amount, date;
        switch (planId) {   // Basic , advanced, business
            case 'Basic':
                plan = 'Basic';
                credits = 100 ;    // 100 credits per 10 doller
                amount = 99*100 ;       //99 rupees
                break;

            case 'Advanced':
                plan = 'Advanced';
                credits = 500;
                amount = 499*100;
                break;

            case 'Business':
                plan = 'Business';
                credits = 5000;
                amount = 2499*100;
                break;

            default:
                return res.json({ success: false, message: "Invalid Plan Selected" });
        }
        date = Date.now();

        //creating transcation
        const transactionData = {
            clerkId, plan, amount: amount /100 , credits, date
        }

        const newTransaction = await transactionModel.create(transactionData);

        // Create Stripe Payment Intent
        const paymentIntent = await stripeInstance.paymentIntents.create({
            amount, 
            currency: process.env.CURRENCY || "inr",
            metadata: {
                transactionId: newTransaction._id.toString(),
                clerkId
            },
        });

        // Respond with client_secret so frontend can complete payment
        return res.json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            message: "Payment initiated successfully",
            transactionId: newTransaction._id.toString(),
        });

        // const options ={
        //     amount :amount *100 ,
        //     currency : process.env.CURRENCY,
        //     receipt : newTransaction._id    // auto generate on database after payment
        // }

        // // now stripe payment instance

        // await stripeInstance.orders.create(options ,(error, order)=>{
        //     if(error){
        //         return res.json({success :false , message :error.message});
        //     }
        //     res.json({success:true , order});
        // })

    } catch (error) {
        console.log("stripe payment error", error.message);
        res.json({ success: false, message: error.message });
    }
}

const markPayment = async(req,res)=>{
    try {
        const { transactionId } = req.body;
        if (!transactionId) return res.json({ success: false, message: "No transactionId provided" });
    
        await transactionModel.findByIdAndUpdate(transactionId, { payment: true });
        res.json({ success: true, message: "Payment status updated" });
      } catch (err) {
        res.json({ success: false, message: err.message });
      }
}

// ✅ Controller: Update user's credits after successful payment
const updateUserCredits = async (req, res) => {
  try {
    const { credits, transactionId } = req.body;

    if (!credits) {
      return res.json({ success: false, message: "No credits provided" });
    }

    const clerkId = req.user?.clerkId; // from auth middleware
    if (!clerkId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    // 1️⃣ Find user
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // 2️⃣ Increase user's credits
    user.creditBalance = (user.creditBalance || 0) + credits;
    await user.save();

    // 3️⃣ Optionally update transaction record
    if (transactionId) {
      await transactionModel.findByIdAndUpdate(transactionId, { payment: true });
    }

    res.json({
      success: true,
      message: "✅ Credits updated successfully!",
      newCreditBalance: user.creditBalance,
    });
  } catch (error) {
    console.log("❌ updateUserCredits error:", error.message);
    res.json({ success: false, message: error.message });
  }
};


module.exports = { clerkWebHooks, userCredits, paymentStripe,updateUserCredits,markPayment };



