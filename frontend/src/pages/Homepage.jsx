import React from 'react';
import Header from '../components/Header';

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

            <footer style={{ textAlign: 'center', padding: '24px 0', borderTop: '1px solid #eee', color: '#666' }}>
                © {new Date().getFullYear()} Futabus
            </footer>
        </>
    );
}

function Feature({ title, description }) {
    return (
        <div style={{ padding: 16, border: '1px solid #f0f0f0', borderRadius: 8, background: '#fff' }}>
            <h3 style={{ margin: '0 0 8px' }}>{title}</h3>
            <p style={{ margin: 0, color: '#555' }}>{description}</p>
        </div>
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