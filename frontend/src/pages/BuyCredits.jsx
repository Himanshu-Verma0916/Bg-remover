import React from 'react';
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";
import { assets, plans } from '../assets/assets';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';


const BuyCredits = () => {
  const { loadCreditData, backendURL, stripePromise } = useContext(AppContext);
  const navigate = useNavigate();
  const { getToken } = useAuth();  // from clerk hook

  // ⚡ Step 1: Modified to accept transactionId
  const initPay = async (clientSecret, transactionId ,planId) => {
    const stripe = await stripePromise;

    // open stripe payment window

    // const { error } = await stripe.confirmCardPayment(clientSecret, {
    //   payment_method: {
    //     card: { token: "auto" }, // handled by Stripe Elements in production
    //   },
    // });
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: "pm_card_visa", // ✅ use Stripe test card
    });

    if (error) {
      toast.error(error.message || "Payment Failed");
      console.error("❌ Stripe Payment Error:", error);
    } else if (paymentIntent.status === "succeeded") {
      toast.success(" Payment successful!");
      // ⚡ Step 2: Update payment to true in DB (frontend only)
      try {
        const token = await getToken();
        await axios.put(
          `${backendURL}/api/users/mark-payment`,
          { transactionId },
          { headers: { token } }
        );

        // Step 2: increase user's credits manually
        const plan = plans.find(p => p.id === planId);
        if (plan) {
          await axios.put(
            `${backendURL}/api/users/update-credits`,
            { credits: plan.credits }, // add this much credit
            { headers: { token } }
          );
        }
      } catch (err) {
        console.error("⚠️ Failed to update payment status:", err.message);
      }


      await loadCreditData(); // reload user credits after payment
      navigate("/"); // redirect after payment success

    }

  }

  const paymentStripe = async (planId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(`${backendURL}/api/users/pay-stripe`, { planId }, { headers: { token } });

      if (data.success) {  // after data success from backend api , we initialize payment
        initPay(data.clientSecret, data.transactionId, planId);
      }

    } catch (err) {
      console.log(err.message);
      toast.error(err.message);
    }

  }

  return (
    <div className='pt-5 mb-10 text-center mx-4 my-3 lg:mx-44 min-h-[80vh]'>
      <button className='px-8 py-2 border text-violet-600 text-sm border border-violet-600 rounded-full  hover:scale-105 transition-all duration-700 mb-4'>OUR PLANS</button>
      <h1 className='text-center text-2xl  md:text-3xl lg:text-4xl mb-16 font-semibold bg-gradient-to-r from-neutral-900 to-neutral-300 bg-clip-text text-transparent mb-6 sm:mb-10 '>Choose the plan that's right for you</h1>
      <div className='flex flex-wrap justify-center text-left gap-6'>
        {plans.map((item, index) => (
          <div key={index} className='bg-white drop-shadow-lg border border-gray-200 rounded-lg px-8 py-12 text-gray-700 hover:scale-105 transition-all duration-700'>
            <img width={40} src={assets.logo_icon} alt="" />
            <p className='mt-3 font-semibold'>{item.id}</p>
            <p className='text-sm'>{item.desc}</p>
            <p className='mt-6'>
              <span className='text-3xl font-medium'>₹{item.price}</span> / {item.credits} credits
            </p>
            <button onClick={() => paymentStripe(item.id)} className='w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52'>Purchase</button>
          </div>
        ))}

      </div>
    </div>
  )
}

export default BuyCredits
