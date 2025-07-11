import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'motion/react';

const LifeDropLoader = () => {
  const dropControls = useAnimation();
  const textControls = useAnimation();
  const textRef = useRef(null);

  useEffect(() => {
    const animate = async () => {
      while (true) {
        // Reset drop position (above text)
        await dropControls.start({
          y: -150,
          opacity: 1,
          transition: { duration: 0 }
        });

        // Animate drop falling
        await dropControls.start({
          y: 60, // Adjust this value based on your text height
          opacity: 1,
          transition: { duration: 1.5, ease: "easeOut" }
        });

        // Change text color when drop hits
        await textControls.start({
          color: "#dc2626",
          boxShadow: "0 0 20px rgba(220, 38, 38, 0.7)",
          transition: { duration: 0.5 }
        });

        // Reset text color
        await textControls.start({
          color: ["#dc2626", "#4b5563"],
          boxShadow: "none",
          transition: { duration: 1 }
        });

        // Small delay before restarting
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    };

    animate();

    return () => {
      // Cleanup if needed
    };
  }, [dropControls, textControls]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
      <div className="relative h-64 flex items-center justify-center">
        {/* Blood Drop */}
        <motion.div
          animate={dropControls}
          className="absolute w-12 h-16 bg-red-600"
          style={{
            borderRadius: '80% 0 55% 55% / 55% 0 80% 55%',
            transform: 'rotate(-45deg)',
            top: 0,
            left: '50%',
            x: '-50%',
            opacity: 0,
            filter: 'drop-shadow(0 0 4px rgba(220, 38, 38, 0.7)'
          }}
        />

        {/* LifeDrop Text */}
        <motion.div
          ref={textRef}
          animate={textControls}
          className="text-5xl sm:text-6xl font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-center"
          style={{ 
            color: '#4b5563',
            marginTop: '100px',
            padding: '0.5rem 1rem'
          }}
        >
          LifeDrop
        </motion.div>
      </div>
    </div>
  );
};

export default LifeDropLoader;