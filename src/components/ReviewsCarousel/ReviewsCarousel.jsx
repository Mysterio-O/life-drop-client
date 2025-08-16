import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaArrowRight, FaQuoteLeft } from 'react-icons/fa';

// Sample reviews data
const reviews = [
    {
        id: 1,
        name: 'Ayesha Rahman',
        text: 'LifeDrop saved my brother’s life by quickly connecting us with a blood donor. The platform is easy to use and the team is incredibly supportive!',
        role: 'Grateful Family Member',
    },
    {
        id: 2,
        name: 'Dr. Imran Khan',
        text: 'As a doctor, I highly recommend LifeDrop for its efficient system and dedicated volunteers. It’s making a real difference in Bangladesh.',
        role: 'Medical Professional',
    },
    {
        id: 3,
        name: 'Sadia Islam',
        text: 'Volunteering with LifeDrop has been an amazing experience. I feel proud to contribute to such a meaningful cause!',
        role: 'Volunteer',
    },
    {
        id: 4,
        name: 'Rahul Das',
        text: 'The urgency of my request was met with immediate action. LifeDrop’s community is truly lifesaving!',
        role: 'Blood Recipient',
    },
    {
        id: 5,
        name: 'Fatima Begum',
        text: 'LifeDrop’s quick response and dedicated team helped me find a blood donor for my daughter in a critical moment. Forever grateful!',
        role: 'Parent',
    },
    {
        id: 6,
        name: 'Mehedi Hasan',
        text: 'The platform’s user-friendly interface made it easy for me to donate blood and help someone in need. LifeDrop is truly impactful!',
        role: 'Blood Donor',
    },
    {
        id: 7,
        name: 'Nusrat Jahan',
        text: 'Being part of LifeDrop’s volunteer network has given me a sense of purpose. Their commitment to saving lives is inspiring!',
        role: 'Volunteer Coordinator',
    },
];

const ReviewsCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    // Calculate indices for the three visible cards
    const getVisibleReviews = () => {
        const length = reviews.length;
        const prevIndex = (currentIndex - 1 + length) % length;
        const nextIndex = (currentIndex + 1) % length;
        return [
            { review: reviews[prevIndex], position: 'left' },
            { review: reviews[currentIndex], position: 'center' },
            { review: reviews[nextIndex], position: 'right' },
        ];
    };

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    };

    const handlePrev = () => {
        setDirection(-1);
        setCurrentIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
    };

    // Animation variants for card positions
    const variants = {
        left: {
            x: '-33%',
            y: 0,
            opacity: 0.6,
            scale: 0.9,
            zIndex: 1,
            transition: { duration: 0.5, ease: 'easeInOut' },
        },
        center: {
            x: '0%',
            y: -20,
            opacity: 1,
            scale: 1,
            zIndex: 10,
            transition: { duration: 0.5, ease: 'easeInOut' },
        },
        right: {
            x: '33%',
            y: 0,
            opacity: 0.6,
            scale: 0.9,
            zIndex: 1,
            transition: { duration: 0.5, ease: 'easeInOut' },
        },
    };

    const visibleReviews = getVisibleReviews();

    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="py-12 px-2 md:px-0 bg-white dark:bg-[#0F172A] overflow-hidden"
        >
            <div className="container mx-auto px-4">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-3xl md:text-4xl font-bold text-center text-[#111827] dark:text-[#F8FAFC] mb-8"
                >
                    What Our Community Says
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-center text-lg text-[#4B5563] dark:text-[#94A3B8] mb-10 max-w-2xl mx-auto"
                >
                    Hear from those who have experienced the impact of LifeDrop’s mission.
                </motion.p>
                <div className="relative max-w-6xl mx-auto">
                    <div className="flex justify-center gap-4 md:gap-8 relative h-[300px]">
                        {visibleReviews.map(({ review, position }, index) => (
                            <motion.div
                                key={review.id}
                                initial={
                                    direction > 0
                                        ? { x: '33%', y: 0, opacity: 0.6, scale: 0.9 }
                                        : { x: '-33%', y: 0, opacity: 0.6, scale: 0.9 }
                                }
                                animate={variants[position]}
                                className="absolute w-full md:w-1/3 bg-[#F9FAFB] dark:bg-[#1E293B] p-6 rounded-lg shadow-lg border border-[#E5E7EB] dark:border-[#334155] text-center"
                            >
                                <FaQuoteLeft className="text-[#D32F2F] dark:text-[#EF5350] text-3xl mx-auto mb-4" />
                                <p className="text-base md:text-lg text-[#4B5563] dark:text-[#94A3B8] mb-6">
                                    {review.text}
                                </p>
                                <h3 className="text-lg md:text-xl font-semibold text-[#111827] dark:text-[#F8FAFC]">
                                    {review.name}
                                </h3>
                                <p className="text-sm text-[#4B5563] dark:text-[#94A3B8]">
                                    {review.role}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                    <div className="flex justify-center gap-4 mt-4">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handlePrev}
                            className="p-3 rounded-full bg-[#D32F2F] dark:bg-[#EF5350] text-white hover:bg-[#B71C1C] dark:hover:bg-[#F44336] transition-colors"
                        >
                            <FaArrowLeft />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleNext}
                            className="p-3 rounded-full bg-[#D32F2F] dark:bg-[#EF5350] text-white hover:bg-[#B71C1C] dark:hover:bg-[#F44336] transition-colors"
                        >
                            <FaArrowRight />
                        </motion.button>
                    </div>
                </div>
                <div className="flex justify-center mt-6">
                    {reviews.map((_, index) => (
                        <motion.div
                            key={index}
                            className={`h-2 w-2 rounded-full mx-1 ${
                                index === currentIndex
                                    ? 'bg-[#D32F2F] dark:bg-[#EF5350]'
                                    : 'bg-[#E5E7EB] dark:bg-[#334155]'
                            }`}
                            whileHover={{ scale: 1.2 }}
                            onClick={() => {
                                setDirection(index > currentIndex ? 1 : -1);
                                setCurrentIndex(index);
                            }}
                        />
                    ))}
                </div>
            </div>
        </motion.section>
    );
};

export default ReviewsCarousel;