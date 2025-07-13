import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img  className='w-full md:max-w-[360px]'src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>Welcome to Prescripto ,your trusted partner in mangaing your healthcare needs conviniently and efficiently . At Prescripto we understood the challenges indivaiduals face when it comes to scheduling doctor appointments and amanaging their heath recordes.  </p>
          <p>Precripto is commited to excellence in healthcare Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corrupti cupiditate laboriosam doloremque enim fuga libero magnam alias necessitatibus, expedita eveniet!</p>
          <b className='text-gray-800'>Our Vision</b>
          <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Earum itaque beatae rem repellat, ducimus qui voluptatem odio illo excepturi iusto tempore nesciunt soluta aliquam, nisi ullam nobis quibusdam magni cupiditate!</p>
        </div>
      </div>
      <div className='text-xl my-4'>
        <p>Why <span className='text-gray-700 font-semibold'>Choose Us</span></p>
      </div>
      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-6 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Efficiency:</b>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing.</p>
        </div>
        <div className='border px-10 md:px-6 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
        <b>Convinience</b>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>
        <div className='border px-10 md:px-6 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
        <b>Personalization</b>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quam, animi!</p>
        </div>
      </div>
    </div>
  )
}

export default About
