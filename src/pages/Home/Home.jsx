import React, { useEffect } from 'react';
import Banner from '../../components/Banner/Banner';
import DonationRequests from '../../components/DonationRequests/DonationRequests';
import { useLocation } from 'react-router';
import ContactUs from '../../components/ContactUs/ContactUs';
import Footer from '../../components/Footer/Footer';

const Home = () => {

    const location = useLocation()
    // console.log(location);

    useEffect(() => {
        if (location.hash === '#donation-requests') {
            const element = document.getElementById('donation-requests');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            } else {
                setTimeout(() => {
                    const retryElement = document.getElementById('donation-requests');
                    if (retryElement) {
                        retryElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 500);
            }
        }
    }, [location])

    return (
        <div>
            <section>
                <Banner />
            </section>
            <section id='donation-requests'>
                <DonationRequests />
            </section>
            <section id='contact-us'>
                <ContactUs />
            </section>
            <footer>
                <Footer />
            </footer>
        </div>
    );
};

export default Home;