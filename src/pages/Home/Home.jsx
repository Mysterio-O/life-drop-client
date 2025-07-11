import React from 'react';
import Banner from '../../components/Banner/Banner';
import DonationRequests from '../../components/DonationRequests/DonationRequests';

const Home = () => {
    return (
        <div>
            <section>
                <Banner />
            </section>
            <section>
                <DonationRequests />
            </section>
        </div>
    );
};

export default Home;