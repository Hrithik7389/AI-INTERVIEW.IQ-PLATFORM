import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AuthModel from '../components/AuthModel'

import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmarkText
} from "react-icons/bs"

import { HiSparkles } from "react-icons/hi"
import { motion } from "framer-motion"

import hrImg from "../assets/HR.png"
import techImg from "../assets/tech.png"
import confidenceImg from "../assets/confi.png"
import creditImg from "../assets/credit.png"
import evalImg from "../assets/ai-ans.png"
import resumeImg from "../assets/resume.png"
import pdfImg from "../assets/pdf.png"
import analyticsImg from "../assets/history.png"

function Home() {

  const { userData } = useSelector((state) => state.user)

  const [showAuth, setShowAuth] = useState(false)

  const navigate = useNavigate()

  const handleNavigation = (path) => {
    if (!userData) {
      setShowAuth(true)
      return
    }

    navigate(path)
  }

  const steps = [
    {
      icon: <BsRobot size={24} />,
      step: "STEP 1",
      title: "Role & Experience Selection",
      desc: "AI adjusts difficulty based on selected job role."
    },
    {
      icon: <BsMic size={24} />,
      step: "STEP 2",
      title: "Smart Voice Interview",
      desc: "Dynamic follow-up questions based on your answers."
    },
    {
      icon: <BsClock size={24} />,
      step: "STEP 3",
      title: "Timer Based Simulation",
      desc: "Real interview pressure with time tracking."
    }
  ]

  const aiFeatures = [
    {
      image: evalImg,
      icon: <BsBarChart size={20} />,
      title: "AI Answer Evaluation",
      desc: "Scores communication, technical accuracy and confidence."
    },
    {
      image: resumeImg,
      icon: <BsFileEarmarkText size={20} />,
      title: "Resume Based Interview",
      desc: "Project-specific questions based on uploaded resume."
    },
    {
      image: pdfImg,
      icon: <BsFileEarmarkText size={20} />,
      title: "Downloadable PDF Report",
      desc: "Detailed strengths, weaknesses and improvement insights."
    },
    {
      image: analyticsImg,
      icon: <BsBarChart size={20} />,
      title: "History & Analytics",
      desc: "Track progress with performance graphs and topic analysis."
    }
  ]

  const interviewModes = [
    {
      image: hrImg,
      title: "HR Interview Mode",
      desc: "Behavioural and communication based evaluation."
    },
    {
      image: techImg,
      title: "Technical Mode",
      desc: "Deep technical questioning based on selected role."
    },
    {
      image: confidenceImg,
      title: "Confidence Detection",
      desc: "Basic tone and voice analysis insight."
    },
    {
      image: creditImg,
      title: "Credits System",
      desc: "Unlock premium interview sessions."
    }
  ]

  return (
    <div className='min-h-screen bg-[#f3f3f3] flex flex-col'>

      <Navbar />

      <div className='flex-1 px-4 sm:px-6 md:px-10 lg:px-20 py-12 sm:py-16 md:py-20'>

        {/* HERO SECTION */}

        <div className='flex justify-center mb-6'>
          <div className='bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full flex items-center gap-2'>
            <HiSparkles size={16} className='text-green-600' />
            <span>Welcome to AI Interview Platform</span>
          </div>
        </div>

        <div className='text-center mb-20 sm:mb-24 md:mb-28'>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight max-w-4xl mx-auto'
          >
            Practice Interviews with
            <br />

            <span className='relative inline-block mt-2'>
              <span className='bg-green-100 text-green-600 px-4 sm:px-5 py-1 rounded-full'>
                AI Intelligence
              </span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className='text-gray-500 mt-6 max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-2'
          >
            Role-based mock interviews with smart follow-ups,
            adaptive difficulty and real-time performance evaluation.
          </motion.p>

          <div className='flex flex-col sm:flex-row justify-center items-center gap-4 mt-10'>

            <motion.button
              onClick={() => handleNavigation('/interview')}
              whileHover={{ opacity: 0.9, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className='w-full sm:w-auto bg-black text-white px-6 sm:px-10 py-3 rounded-full shadow-md hover:opacity-90 transition'
            >
              Start Interview
            </motion.button>

            <motion.button
              onClick={() => handleNavigation('/history')}
              whileHover={{ opacity: 0.9, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className='w-full sm:w-auto border border-gray-300 px-6 sm:px-10 py-3 rounded-full hover:bg-gray-100 transition'
            >
              View History
            </motion.button>

          </div>

        </div>

        {/* STEPS SECTION */}

        <div className='flex flex-col md:flex-row justify-center items-center gap-10 mb-28'>

          {steps.map((item, index) => (

            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 + index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className={`relative bg-white rounded-3xl border-2 border-green-100 hover:border-green-500 p-10 w-80 max-w-[90%] shadow-md hover:shadow-2xl transition-all duration-300
              
              ${index === 0 ? "rotate-[-4deg]" : ""}
              ${index === 1 ? "rotate-[3deg] md:-mt-6 shadow-xl" : ""}
              ${index === 2 ? "rotate-[-3deg]" : ""}
              `}
            >

              <div className='flex flex-col items-center text-center gap-3'>

                <div className='text-green-600'>
                  {item.icon}
                </div>

                <p className='text-xs text-gray-500'>
                  {item.step}
                </p>

                <h3 className='font-semibold text-lg'>
                  {item.title}
                </h3>

                <p className='text-sm text-gray-500'>
                  {item.desc}
                </p>

              </div>

            </motion.div>

          ))}

        </div>

        {/* ADVANCED AI SECTION */}

        <div className='mb-32'>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='text-4xl font-semibold text-center mb-16'
          >
            Advanced AI{" "}
            <span className='text-green-600'>
              Capabilities
            </span>
          </motion.h2>

          <div className='grid md:grid-cols-2 gap-10'>

            {aiFeatures.map((item, index) => (

              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className='bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all'
              >

                <div className='flex flex-col md:flex-row items-center gap-8'>

                  <div className='w-full md:w-1/2 flex justify-center'>
                    <img
                      src={item.image}
                      alt={item.title}
                      className='w-40 h-40 object-contain'
                    />
                  </div>

                  <div className='w-full md:w-1/2'>

                    <div className='bg-green-50 text-green-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6'>
                      {item.icon}
                    </div>

                    <h3 className='font-semibold mb-3 text-xl'>
                      {item.title}
                    </h3>

                    <p className='text-gray-500 text-sm leading-relaxed'>
                      {item.desc}
                    </p>

                  </div>

                </div>

              </motion.div>

            ))}

          </div>

        </div>

        {/* MULTIPLE INTERVIEW MODES */}

        <div className='mb-32'>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='text-4xl font-semibold text-center mb-16'
          >
            Multiple Interview{" "}
            <span className='text-green-600'>
              Modes
            </span>
          </motion.h2>

          <div className='grid md:grid-cols-2 gap-10'>

            {interviewModes.map((item, index) => (

              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className='bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all'
              >

                <div className='flex flex-col md:flex-row items-center gap-8'>

                  <div className='w-full md:w-1/2 flex justify-center'>
                    <img
                      src={item.image}
                      alt={item.title}
                      className='w-40 h-40 object-contain'
                    />
                  </div>

                  <div className='w-full md:w-1/2'>

                    <h3 className='font-semibold mb-3 text-xl'>
                      {item.title}
                    </h3>

                    <p className='text-gray-500 text-sm leading-relaxed'>
                      {item.desc}
                    </p>

                  </div>

                </div>

              </motion.div>

            ))}

          </div>

        </div>

      </div>

      {showAuth && (
        <AuthModel onClose={() => setShowAuth(false)} />
      )}

      <Footer />

    </div>
  )
}

export default Home