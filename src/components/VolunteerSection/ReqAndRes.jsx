import React from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { FaCheckCircle, FaTasks } from 'react-icons/fa';

const ReqAndRes = () => {
  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeInOut' }
  };

  const cardVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3, delay: 0.1 }
  };

  const requirements = [
    { id: 1, text: 'Be at least 18 years old.' },
    { id: 2, text: 'Maintain good physical health with no major medical conditions.' },
    { id: 3, text: 'Commit to a minimum of 5 hours per week.' },
    { id: 4, text: 'Have access to email and phone for coordination.' },
    { id: 5, text: 'Complete LifeDrop’s volunteer training program.' }
  ];

  const responsibilities = [
    { id: 1, text: 'Assist with coordinating blood donation requests and connecting donors with requesters.' },
    { id: 2, text: 'Communicate promptly and professionally with donors and requesters.' },
    { id: 3, text: 'Promote LifeDrop’s mission in your community to raise awareness.' },
    { id: 4, text: 'Maintain confidentiality of sensitive donor and requester information.' },
    { id: 5, text: 'Report activities, issues, or feedback to LifeDrop administrators.' }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      transition="transition"
      className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0F172A] p-4"
    >
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        transition="transition"
        className="max-w-3xl w-full bg-[#F9FAFB] dark:bg-[#1E293B] p-8 rounded-xl shadow-md"
      >
        <motion.h1
        initial={{scale:0.85,y:20}}
        animate={{scale:1,y:0}}
        transition={{duration:0.3,ease:'easeIn'}}
        className="text-3xl font-bold mb-6 text-center text-[#111827] dark:text-[#F8FAFC]">
          Volunteer Requirements & Responsibilities
        </motion.h1>

        <section aria-labelledby="requirements-heading" className="mb-8">
          <motion.h2
          initial={{x:-20, opacity:0}}
          animate={{x:0,opacity:1}}
          transition={{duration:0.3,ease:"easeInOut"}}
          id="requirements-heading" className="text-2xl font-semibold mb-4 text-[#111827] dark:text-[#F8FAFC] flex items-center gap-2">
            <FaCheckCircle className="text-[#22C55E] dark:text-[#4CAF50]" /> Requirements
          </motion.h2>
          <ul className="space-y-3 text-[#4B5563] dark:text-[#94A3B8]">
            {requirements.map((req,i) => (
              <motion.li
              initial={{opacity:0,x:-30}}
              animate={{opacity:1,x:0}}
              transition={{duration:0.3,delay:0.2 * i, ease: 'easeInOut'}}
              key={req.id} className="flex items-start gap-2">
                <FaCheckCircle className="text-[#22C55E] dark:text-[#4CAF50] mt-1" />
                <span>{req.text}</span>
              </motion.li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="responsibilities-heading" className="mb-8">
          <motion.h2
          initial={{opacity:0,x:40}}
          animate={{opacity:1,x:0}}
          transition={{duration:0.3,delay:1,ease:"easeInOut"}}
          id="responsibilities-heading" className="text-2xl font-semibold mb-4 text-[#111827] dark:text-[#F8FAFC] flex items-center gap-2">
            <FaTasks className="text-[#D32F2F] dark:text-[#EF5350]" /> Responsibilities
          </motion.h2>
          <ul className="space-y-3 text-[#4B5563] dark:text-[#94A3B8]">
            {responsibilities.map((resp,i) => (
              <motion.li
              initial={{opacity:0,x:40}}
              animate={{opacity:1,x:0}}
              transition={{duration:0.3,delay: 0.2 * (i+1), ease:"easeInOut"}}
              key={resp.id} className="flex items-start gap-2">
                <FaTasks className="text-[#D32F2F] dark:text-[#EF5350] mt-1" />
                <span>{resp.text}</span>
              </motion.li>
            ))}
          </ul>
        </section>

        <div className="text-center">
          <Link
            to="/"
            className="inline-block p-3 rounded-md bg-[#D32F2F] dark:bg-[#EF5350] text-white hover:bg-[#B71C1C] dark:hover:bg-[#F44336] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReqAndRes;