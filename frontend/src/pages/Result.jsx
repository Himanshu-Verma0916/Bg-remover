import React from 'react';
import { assets } from '../assets/assets';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Result = () => {
  const { image, resultImage } = useContext(AppContext);
  const navigate =useNavigate();

  return (
    <div className="mx-4 my-3 lg:mx-44 min-h-[80vh]">
      <div className="bg-white rounded-lg px-8 py-6 drop-shadow-xl">
        {/* Image container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">

          {/* Left side image */}
          <div >
            <p className="text-gray-600 mb-2 font-semibold">Original</p>
            <div className=" border rounded-md ">
              {/* <img src={assets.image_w_bg} alt="Original" className="rounded-md border " /> */}
              <img src={image ? URL.createObjectURL(image) : ''} alt="Original" className="rounded-md border " />
            </div>
          </div>

          {/* Right side image */}
          <div className="flex flex-col">
            <p className="text-gray-600 mb-2 font-semibold">Background Removed</p>
            <div className=" border border-gray-300 rounded-md h-full relative  overflow-hidden bg-layer">
              {/* <img src={assets.image_wo_bg} alt="Without background" className="object-contain w-full" /> */}
              <img src={resultImage ? resultImage : ''} alt="Without background" className="object-contain w-full" />
              {/* image loading... */}
              {
                !resultImage && image &&
                <div className='absolute right-1/2 bottom-1/2 transform translate-x-1/2 translate-y-1/2'>
                  <div className="border-4 border-violet-600 rounded-full size-12 border-t-transparent animate-spin"></div>
                </div>
              }

            </div>
          </div>
        </div>

        {/* Buttons */}
        {
          resultImage &&
          <div className="flex justify-center sm:justify-end items-center flex-wrap gap-4 mt-6 ">
            <button onClick={()=>navigate('/')} className="px-6 py-2 border text-violet-600 text-sm border border-violet-600 rounded-full  hover:scale-105 transition-all duration-700">
              Try another image
            </button>
            <a href={resultImage} download className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white hover:scale-105 transition-all duration-700">
              Download Image
            </a>
          </div>
        }

      </div>
    </div>
  );
};

export default Result;
