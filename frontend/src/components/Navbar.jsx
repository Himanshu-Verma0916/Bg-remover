import React from 'react';
import {assets} from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import {useClerk, UserButton, useUser} from '@clerk/clerk-react';
import { useContext, useEffect } from 'react';
import {AppContext} from '../context/AppContext';

const Navbar = () => {
  const {openSignIn} =useClerk();
  const {isSignedIn, user} =useUser();
  const {credit , loadCreditData} =useContext(AppContext);
  const navigate =useNavigate();

  useEffect(()=>{
     if(isSignedIn){
      loadCreditData();
     }
  },[isSignedIn])

  return (
    <div className='flex justify-between mx-4 py-3 lg:mx-44'>
      <Link to='/'><img className='w-32 sm:w-44' src={assets.logo} alt=''/></Link>
      {
        isSignedIn ? 
        <div className='flex items-center gap-2 sm:gap-3 '>
          <button onClick={()=> navigate('/buy-credits')} className='bg-white border border-gray-300 flex items-center gap-2 px-4 py-1 sm:px-6 sm:py-3 text-sm rounded-full mr-4 hover:scale-105 transition-all duration-700'>
            <img className='w-5 sm:w-6' src={assets.credit_icon} alt=''/>
            <span className='text-gray-600 font-medium'>Credit left: {credit}</span>
          </button>
          <p className='text-gray-600 max-sm:hidden'>Hi, {user.fullName}</p>
          <UserButton />
        </div>
        :
        <button onClick={()=> openSignIn({})} className='bg-zinc-800 text-white flex items-center gap-4 px-4 py-2 sm:px-8 sm:py-3 text-sm rounded-full'>Get started 
        <img className='w-4 sm:w-5' src={assets.arrow_icon} alt=''/> 
        </button>
      }

    </div>
  )
}

export default Navbar;


