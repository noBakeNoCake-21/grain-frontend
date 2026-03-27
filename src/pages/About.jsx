import Header from "../components/Header";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import { useState, useEffect } from "react";

import '../css/About.css';


function About() {

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // simulate loading for 1.5 seconds
        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);


    if (loading) return <div><Loading /></div>;
    return (
        <>
            <Header />
            <div className="aboutContainer">
                <section className="hero">
                    <h1 className="aboutTitle">Share Your Story with the World</h1>
                    <p className="aboutSubtitle">
                        Grain is a platform built for filmmakers to upload their work and showcase it globally.
                        It's completely free, giving creators a space to share their stories without barriers,
                        while viewers explore a growing library of independent films.
                    </p>
                </section>


                <div className="divider" />


                <section className="whySection">
                    <h2 className="whySectionTitle">Why Grain?</h2>
                    <p className="whySectionSubtitle">
                        Grain exists to give filmmakers a place to be seen. No gatekeeping, no paywalls—just a space
                        where creativity can live and be discovered. Upload your films, reach new audiences, and share your vision with the world.
                        Or, discover unique films from creators everywhere and support independent storytelling.
                    </p>
                </section>

                <div className="divider" />


                <section className="aboutMe">
                    <h2 className="aboutMeTitle">Who Made it?</h2>
                    <p className="aboutMeSubtitle">
                        Lakshay Guliani, a full-stack developer focused on building experiences that blend technology and storytelling.
                        With experience in JavaScript, React, Node.js, and Express, he has developed real-world applications beyond just tutorials.
                        As the creator of Grain, he built a platform that gives filmmakers a space to share their work and connect with audiences.
                        His approach to development centers on problem-solving, strong fundamentals, and building clean, scalable solutions.
                        He is working toward a career that combines software and media to create impactful, creative platforms.
                    </p>
                </section>

            </div>
            <Footer />
        </>
    );
}

export default About; 