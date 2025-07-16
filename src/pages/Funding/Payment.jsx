import React, { useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { motion } from 'motion/react';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';

const Payment = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [error, setError] = useState('');

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        const form = e.target;
        const amount = parseFloat(form.amount.value);

        if(!amount){
            setError('Please enter a valid amount greater than 0.');
            Swal.fire({
                icon: 'error',
                title: 'Invalid Amount',
                text: 'Please enter a valid donation amount.',
                confirmButtonColor: '#D32F2F',
                customClass: { confirmButton: 'dark:bg-[#EF5350]' },
            });
            setLoading(false);
            return;
        }

        const amountInCents = amount * 100;

        if (!stripe || !elements) {
            return;
        }

        const card = elements.getElement(CardElement);
        if (card === null) {
            setLoading(false)
            return;
        }

        const { error: validationError, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (validationError) {
            console.log('error validating card', validationError);
            setError(validationError.message);
            Swal.fire({
                icon: 'error',
                title: 'Card Error',
                text: validationError.message,
                confirmButtonColor: '#D32F2F',
                customClass: { confirmButton: 'dark:bg-[#EF5350]' },
            });
            setLoading(false);
        } else {
            setError('');
            // console.log('[PaymentMethod]', paymentMethod);

            const res = await axiosSecure.post('/create-payment-intent', {
                amount: amountInCents,
                paymentMethodId: paymentMethod.id,
            });
            // console.log(res);

            const clientSecret = res.data.clientSecret;

            const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: user.displayName,
                        email: user.email,
                    },
                },
            });

            if (confirmError) {
                setError(confirmError.message);
                Swal.fire({
                    icon: 'error',
                    title: 'Payment Failed',
                    text: confirmError.message,
                    confirmButtonColor: '#D32F2F',
                    customClass: { confirmButton: 'dark:bg-[#EF5350]' },
                });
                setLoading(false)
            } else if (paymentIntent.status === 'succeeded') {
                setError('');                
                // console.log('payment succeeded', paymentIntent);

                const paymentData = {
                    donated_by: user.email,
                    donated_at: new Date().toISOString(),
                    amount,
                    currency: paymentIntent.currency,
                    payment_method: paymentIntent.payment_method_types,
                };

                const paymentRes = await axiosSecure.post('/funding-payments', paymentData);
                if (paymentRes.data.result.insertedId) {
                    form.reset();
                    setLoading(false);
                    Swal.fire({
                    icon: 'success',
                    title: 'Thanks for trusting in LifeDrop',
                    text: `Transaction ID: ${paymentIntent.id}`,
                    confirmButtonColor: '#111827',
                    customClass: { confirmButton: 'dark:bg-[#F8FAFC]' },
                });
                }
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex items-center justify-center bg-[#FFFFFF] dark:bg-[#0F172A] p-4"
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="max-w-md w-full bg-[#F9FAFB] dark:bg-[#1E293B] p-8 rounded-xl shadow-lg"
            >
                <h2 className="text-2xl font-bold mb-2 text-center text-[#111827] dark:text-[#F8FAFC]">
                    Support LifeDrop
                </h2>
                <p className="text-sm text-[#4B5563] dark:text-[#94A3B8] mb-6 text-center">
                    Your donation saves lives. Every contribution helps us provide critical blood donations to those in need. Thank you for making a difference!
                </p>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <CardElement
                            className="p-4 border border-[#E5E7EB] dark:border-[#334155] rounded-md bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350] transition-all duration-300"
                            options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#111827',
                                        '::placeholder': { color: '#4B5563' },
                                    },
                                    invalid: { color: '#D32F2F' },
                                },
                            }}
                        />
                        {error && <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-2">{error}</p>}
                    </motion.div>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <label className="block text-sm font-medium text-[#111827] dark:text-[#F8FAFC] mb-2">
                            Donation Amount ($)
                        </label>
                        <input
                            type="number"
                            name="amount"
                            min="1"
                            step="0.01"
                            className="w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350"
                            placeholder="Enter amount"
                        />
                    </motion.div>
                    <motion.button
                        type="submit"
                        className="w-full p-3 rounded-md bg-[#D32F2F] dark:bg-[#EF5350] text-white hover:bg-[#B71C1C] dark:hover:bg-[#F44336] transition-colors cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        disabled={!stripe && loading}
                    >
                        {
                            loading ? <span className="loading loading-spinner text-neutral"></span> 
                            : 'Donate Now'
                        }
                        
                    </motion.button>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default Payment;