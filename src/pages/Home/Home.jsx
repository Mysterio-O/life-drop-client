import React, { useEffect } from 'react';
import Banner from '../../components/Banner/Banner';
import DonationRequests from '../../components/DonationRequests/DonationRequests';
import { useLocation } from 'react-router';
import ContactUs from '../../components/ContactUs/ContactUs';
import Footer from '../../components/Footer/Footer';
import FeaturedSection from '../../components/FeaturedSection/FeaturedSection';

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
        if (location.hash === "#contact-us") {
            const element = document.getElementById('contact-us');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            } else {
                setTimeout(() => {
                    const retryElement = document.getElementById('contact-us');
                    if (retryElement) {
                        retryElement.scrollIntoView({ behavior: "smooth" });
                    }
                }, 500)
            }
        }
    }, [location]);

    useEffect(()=> {
        document.title = 'LifeDrop || Home'
    },[])

    return (
        <div>
            <section>
                <Banner />
            </section>
            <section id='donation-requests'>
                <DonationRequests />
            </section>
            <section>
                <FeaturedSection />
            </section>
            <section id='contact-us'>
                <ContactUs />
            </section>
        </div>
    );
};

export default Home;