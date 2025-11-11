import React, {useState} from 'react';
import { assets } from '../assets/assets';

const BgSlider = () => {
    const [sliderPosition, setSliderPosition]=useState(50);

    const handleSliderPosition=(e)=>{
        setSliderPosition(e.target.value);
    }
  
 return (
    <div className='pb-5 md:pb-10 mx-2'>
      {/* title */}
      <h1 className='mb-16 text-center text-2xl  md:text-3xl lg:text-4xl mt-4 font-semibold bg-gradient-to-r from-neutral-900 to-neutral-300 bg-clip-text text-transparent'>
        Remove Background with High <br /> Quality and Accuracy
      </h1>
      
      <div className='relative w-full max-w-3xl overflow-hidden m-auto rounded-xl'>
        {/* background image */}
        <img src={assets.image_w_bg} style={{clipPath : `inset(0 ${100.2-sliderPosition}% 0 0)`}} />
        {/* foreground image */}
        <img className='absolute top-0 left-0 w-full h-full' src={assets.image_wo_bg} style={{clipPath : `inset(0 0 0 ${sliderPosition}% )`}}/>
        
        {/* slider */}
        <input className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full z-10 slider' type='range' min={0} max={100} value={sliderPosition} onChange={handleSliderPosition}/>
      </div>

    </div>
  )
}

export default BgSlider;
