import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../App.css';

export default function Homepage() {
    return (
        <>
            <Header />

            <main style={{ maxWidth: 1100, margin: '2rem auto', padding: '0 1rem' }}>
                <section style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 40 }}>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ margin: '0 0 12px' }}>Welcome to Futabus</h1>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <a href="/search" style={ctaStyle}>Search Trips</a>
                            <a href="/routes" style={secondaryStyle}>View Routes</a>
                        </div>
                    </div>

            
                </section>
            </main>

            <Footer />
        </>
    );
}

const ctaStyle = {
    display: 'inline-block',
    padding: '10px 16px',
    background: '#0052cc',
    color: '#fff',
    borderRadius: 6,
    textDecoration: 'none',
    fontWeight: 600,
};

const secondaryStyle = {
    display: 'inline-block',
    padding: '10px 16px',
    background: '#f3f6ff',
    color: '#0052cc',
    borderRadius: 6,
    textDecoration: 'none',
    fontWeight: 600,
};