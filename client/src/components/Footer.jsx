import React from 'react'
import { BsRobot } from 'react-icons/bs'

function Footer() {
  return (
    <div className='bg-[#f3f3f3] flex justify-center px-4 py-10'>
      <div
        className='w-full max-w-6xl bg-white rounded-[24px] shadow-sm
        border border-gray-200 py-8 px-6 text-center'
      >
        <div className='flex justify-center items-center gap-3 mb-3'>
          <div className='bg-black text-white p-2 rounded-lg'>
            <BsRobot size={16} />
          </div>

          <h2 className='text-xl font-semibold text-gray-800'>
            InterviewIQ.AI
          </h2>
        </div>

        <p className='text-gray-600 text-sm'>
          AI-powered interview preparation platform designed to
          improve communication skills, technical depth and professional confidence.
        </p>

        <div className='mt-6 text-sm text-gray-500'>
          © 2026 InterviewIQ.AI. All rights reserved.
        </div>
      </div>
    </div>
  )
}

export default Footer