import React from 'react';
import {
    CircularProgressbar,
    buildStyles
} from 'react-circular-progressbar';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';

const OverviewCard = ({ card }) => {
    const { Icon } = card;

    const navigate = useNavigate();

    const handleClick = (card) => {
        if (card?.to) {
            navigate(card.to);
        }
    }

    const cardVariants = {
        initial: { scale: 1 },
        whileHover: { scale: 1.1 },
        transition: { duration: 0.3, ease: 'easeInOut' }
    }


    return (
        <motion.div
            variants={cardVariants}
            initial="initial"
            whileHover="whileHover"
            transition="transition"
            onClick={() => handleClick(card)}
            className="bg-white rounded-xl shadow p-6 flex flex-col gap-4 cursor-pointer">
            <div className='flex justify-between items-start'>
                <div>
                    <h4 className="text-gray-500 text-sm font-medium flex justify-center items-center gap-2 text-balance">{card.title}
                        <Icon size={26} className={card.iconColor} />
                    </h4>
                    <h2 className="text-3xl font-bold text-gray-900">{card.value}</h2>
                    <p className={`text-sm mt-1 font-medium`} style={{ color: card.changeColor }}>
                        {card.change}
                    </p>
                </div>
                <div className="w-12 h-12">
                    <CircularProgressbar
                        value={card.progress}
                        text={`${card.progress}%`}
                        styles={buildStyles({
                            textSize: '32px',
                            pathColor: card.color,
                            textColor: card.color,
                            trailColor: '#e5e7eb',
                        })}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default OverviewCard;