const express = require('express');
const {clerkWebHooks, userCredits, createStripePayment, confirmStripePayment, paymentStripe, updateUserCredits, markPayment} =require('../controllers/userController');
const authUser = require('../middleware/auth');
const transactionModel =require('../model/transactionModel');

const userRouter =express.Router();

userRouter.post('/webhooks', clerkWebHooks);
userRouter.get('/credits', authUser, userCredits);
userRouter.post('/pay-stripe', authUser, paymentStripe);

userRouter.put('/mark-payment',markPayment);
// userRouter.put('/update-credits',authUser, userCredits);
userRouter.put('/update-credits', authUser, updateUserCredits);


module.exports = userRouter;
 