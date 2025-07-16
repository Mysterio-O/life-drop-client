import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useEffect } from 'react';
import Payment from './Payment';

const GiveFunding = () => {

    useEffect(() => {
        document.title = 'Give Funding'
    }, [])

    const stripePromise = loadStripe('pk_test_51RgaV6IcJVpdRuBPOmqLUepqvWPQZ7vvUYo34WPnCDSh3X4vZsL8f84vVioO2DSmgFGxRr2H9KeYYLWShmnr5XGi00I8Op6rQ5');

    return (
        <Elements stripe={stripePromise}>
            <Payment className="z-10"/>
        </Elements>
    );
};

export default GiveFunding;