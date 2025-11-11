import React, { useState, createContext } from "react";
import axios from "axios";
import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHED_KEY);


const AppContext = createContext();
const AppContextProvider = (props) => {
    const [credit, setCredit] = useState(false);
    const [image, setImage] = useState(false);  //uploasd image section
    const [resultImage, setResultImage] = useState(false);

    const navigate = useNavigate();

    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const { getToken } = useAuth();  // get token from web hook session (clerkId in token body)
    const { isSignedIn } = useUser(); // checking from clerk web hook 
    const { openSignIn } = useClerk(); // if not signed in during image upload then popup signin portal

    // call the userCredit api
    const loadCreditData = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get(`${backendURL}/api/users/credits`, { headers: { token } });   // fetching actual data from backend api
            setCredit(data.credits);
            console.log("data", data);
            console.log("credit", data.credits);
        } catch (error) {
            console.log(error.message);
            toast.error("Error in fetching credit data");
        }
    }

    // function for managing upload you image for remove bg  & call it at header.js and Upload.js
    const removeBg = async (image) => {
        try {
            // console.log(image);
            if (!isSignedIn) {
                toast.info('Please login first');
                openSignIn();
                return;
            }
            setImage(image);
            setResultImage(false);

            navigate('/result');

            //  recieving result image from imageController api
            const token = await getToken();
            const formData = new FormData();
            image && formData.append('image', image);

            const { data } = await axios.post(`${backendURL}/api/images/remove-bg`, formData, { headers: { token } });
            if (data.success) {
                //base 64 image found in response also
                setResultImage(data.resultImage);
                data.creditBalance && setCredit(data.creditBalance);

                if (data.creditBalance === 0) {
                    navigate('/buy-credits')
                }
            }


        } catch (error) {
            console.log(error.message);
            toast.error("Error in fetching credit data");
        }
    }

    const value = {
        credit, setCredit, loadCreditData, backendURL, image, setImage, removeBg, resultImage, setResultImage, stripePromise
    }

    // useEffect(()=>{
    //     console.log("🟢 Credit data updated:", credit);  //5
    // },[credit])

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
export { AppContext };
export default AppContextProvider;