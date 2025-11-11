import React from 'react'
import { testimonialsData } from '../assets/assets'

const Testimonials = () => {
  return (
    <div className='pb-16'>
        {/* title */}
        <h1 className='text-center text-2xl  md:text-3xl lg:text-4xl mb-16 font-semibold bg-gradient-to-r from-neutral-900 to-neutral-300 bg-clip-text text-transparent'>
            Customer Testimonials
        </h1>

        {/* testimonials */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto'>
            {testimonialsData.map((testimonial ,index) => (
                <div key={index} className='bg-white rounded-2xlp-6 drop-shadow-md max-w-lg m-auto hover:scale-105 transition-all duration-700 p-6 flex flex-col gap-4'>
                    <p className='text-4xl text-gray-500'>"</p>
                    <p className='text-sm text-gray-500'>{testimonial.text}</p>
                    <div className='flex items-center gap-3 mt-3 '>
                        <img className='w-9 rounded-full ' src={testimonial.image} alt=""  />
                        <div>
                            <p>{testimonial.author}</p>
                            <p className='text-sm text-gray-600'>{testimonial.jobTitle}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Testimonials
