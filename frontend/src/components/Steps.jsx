import React from 'react'
import { assets } from '../assets/assets'

const Steps = () => {
    return (
        <div className='mx-4 lg:mx-44 py-10 xl:py-20 mt-0'>
            <h1 className='text-center text-2xl  md:text-3xl lg:text-4xl mb-16 font-semibold bg-gradient-to-r from-neutral-900 to-neutral-300 bg-clip-text text-transparent'>
               Steps to remove background <br /> image in seconds
            </h1>

            <div className='flex items-start flex-wrap  gap-4 mt-14 xl:mt-24 justify-center'>
                
                <div className='flex items-start gap-2 bg-white border drop-shadow-md p-7 pb-10 rounded hover:scale-105 transition-all duration-500 border-hidden'>
                    <img className='max-w-9' src={assets.upload_icon} />
                    <div>
                        <p className='text-xl font-medium'>Upload image</p>
                        <p className='text-sm text-neutral-500 mt-1'>Choose any image from your device.<br/>Supports JPG, PNG, and WebP formats.</p>
                    </div>
                </div>

                <div className='flex items-start gap-2 bg-white border drop-shadow-md p-7 pb-10 rounded hover:scale-105 transition-all duration-500 border-hidden '>
                    <img className='max-w-9' src={assets.remove_bg_icon} />
                    <div>
                        <p className='text-xl font-medium'>Remove background</p>
                        <p className='text-sm text-neutral-500 mt-1'>Let our AI automatically detect and remove<br/>the background in just a few seconds.</p>
                    </div>
                </div>

                <div className='flex items-start gap-2 bg-white border drop-shadow-md p-7 pb-10 rounded hover:scale-105 transition-all duration-500  border-hidden'>
                    <img className='max-w-9' src={assets.download_icon} />
                    <div>
                        <p className='text-xl font-medium'>Download image</p>
                        <p className='text-sm text-neutral-500 mt-1'>Instantly download your high-quality<br/> result with a transparent background</p>
                    </div>
                </div>
                
            </div>

        </div>
    )
}

export default Steps
