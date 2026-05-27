"use client"

import Link from "next/link";

export default function Home() {


    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap');

               
                .landing {
                    min-height: 100vh;
                    font-family: 'Cedarville Cursive';
                    background: #ffffff;
                    display: flex;
                    flex-direction: column;
                    color: #000;
                }

                .landing-nav {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px 40px;
                    border-bottom: 1px solid #f0ede8;
                }

                .landing-logo {
                    font-size: 20px;
                    font-weight: 400;
                    color: #000;
                    text-decoration: none;
                }

                .landing-nav-links {
                    display: flex;
                    align-items: center;
                    gap: 24px;
                }

                .nav-link {
                    font-size: 15px;
                    color: #555;
                    text-decoration: none;
                    font-family: 'Cedarville Cursive';
                    transition: color 0.2s;
                }

                .nav-link:hover { 
                color: #000; 
                 font-size: large;
                font-weight:bold;
                }

                .nav-btn {
                    padding: 8px 20px;
                    background: #000;
                    color: #fff;
                    border: none;
                    border-bottom: 3px solid #333;
                    border-radius: 8px;
                    font-family: 'Cedarville Cursive;
                    font-size: 14px;
                    cursor: pointer;
                    text-decoration: none;
                    transition: all 0.15s;
                    box-shadow: 0 3px 8px rgba(0,0,0,0.15);
                }

                .nav-btn:hover {
                    transform: translateY(-1px);
                }

                .nav-btn:active {
                    transform: translateY(2px);
                    border-bottom-width: 1px;
                    box-shadow: none;
                }

               
                .hero {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 80px 20px;
                    text-align: center;
                    background: 
                        radial-gradient(ellipse at 20% 50%, rgba(0,0,0,0.03) 0%, transparent 60%),
                        radial-gradient(ellipse at 80% 20%, rgba(0,0,0,0.02) 0%, transparent 50%),
                        #fff;
                }

                .hero-badge {
                    display: inline-block;
                    padding: 4px 14px;
                    border: 1px solid #e8e4dd;
                    border-radius: 20px;
                    font-size: 12px;
                    color: #888;
                    margin-bottom: 24px;
                }

                .hero-title {
                    font-size: 52px;
                    font-weight: 400;
                    color: #000;
                    margin-bottom: 20px;
                    line-height: 1.2;
                    text-shadow:
                        1px 1px 0 #ddd,
                        2px 2px 0 #ccc,
                        3px 3px 0 #bbb;
                    max-width: 700px;
                }

                .hero-sub {
                    font-size: 16px;
                    color: #666;
                    margin-bottom: 40px;
                    max-width: 500px;
                    line-height: 1.7;
                }

                .hero-btns {
                    display: flex;
                    gap: 16px;
                    flex-wrap: wrap;
                    justify-content: center;
                }

                .hero-btn-primary {
                    padding: 14px 36px;
                    background: #000;
                    color: #fff;
                    border: none;
                    border-bottom: 4px solid #333;
                    border-radius: 10px;
                    font-family: 'Cedarville Cursive', cursive;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.15s;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    text-decoration: none;
                    display: inline-block;
                }

                .hero-btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.2);
                }

                .hero-btn-primary:active {
                    transform: translateY(3px);
                    border-bottom-width: 1px;
                    box-shadow: none;
                }

                .hero-btn-secondary {
                    padding: 14px 36px;
                    background: #fff;
                    color: #000;
                    border: 1.5px solid #000;
                    border-bottom: 4px solid #000;
                    border-radius: 10px;
                    font-family: 'Cedarville Cursive', cursive;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.15s;
                    text-decoration: none;
                    display: inline-block;
                }

                .hero-btn-secondary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }

                .hero-btn-secondary:active {
                    transform: translateY(3px);
                    border-bottom-width: 1px;
                }

                .features {
                    padding: 80px 40px;
                    background: #fafaf9;
                    border-top: 1px solid #f0ede8;
                }

                .features-title {
                    text-align: center;
                    font-size: 28px;
                    color: #000;
                    margin-bottom: 48px;
                    text-shadow: 1px 1px 0 #ddd, 2px 2px 0 #ccc;
                }

                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                    gap: 24px;
                    max-width: 1000px;
                    margin: 0 auto;
                }

                .feature-card {
                    background: #fff;
                    border: 1.5px solid #e8e4dd;
                    border-radius: 12px;
                    padding: 28px 24px;
                    box-shadow: 0 4px 0 #e0ddd8, 0 6px 12px rgba(0,0,0,0.04);
                    transition: all 0.2s;
                }

                .feature-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 0 #e0ddd8, 0 12px 24px rgba(0,0,0,0.08);
                }

                .feature-icon {
                    font-size: 28px;
                    margin-bottom: 14px;
                }

                .feature-title {
                    font-size: 16px;
                    color: #000;
                    margin-bottom: 8px;
                }

                .feature-desc {
                    font-size: 13px;
                    color: #888;
                    line-height: 1.6;
            } 
                footer {
                    text-align: center;
                    padding: 24px;
                    font-size: 13px;
                    color: black;
                    border-top: 1px solid #f0ede8;
                }

                @media (max-width: 600px) {
                    .landing-nav { padding: 16px 20px; }
                    .hero-title { font-size: 32px; }
                    .hero { padding: 60px 20px; }
                    .features { padding: 60px 20px; }
                    .landing-nav-links { gap: 12px; }
                }
            `}</style>

            <div className="landing">
                <nav className="landing-nav">
                    <span className="landing-logo">formlogiclabs</span>
                    <div className="landing-nav-links">
                        <Link href="/pricing" className="nav-link">Pricing</Link>
                        <Link href="/dashboard" className="nav-link">Dashboard</Link>
                        <Link href="/signup" className="nav-btn">Sign Up</Link>
                    </div>
                </nav>

                <section className="hero">
                    <span className="hero-badge"> Build forms in minutes</span>
                    <h1 className="hero-title">create forms that people actually fill out</h1>
                    <p className="hero-sub">
                        build beautiful forms, share them with anyone, and get real-time analytics on every response.
                    </p>
                    <div className="hero-btns">
                        <Link href="/signup" className="hero-btn-primary">Get started for free</Link>
                        <Link href="/login" className="hero-btn-secondary">Login</Link>
                    </div>
                </section>

                <section className="features">
                    <h2 className="features-title">everything you need</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">✎</div>
                            <h3 className="feature-title">easy form builder</h3>
                            <p className="feature-desc">drag and drop fields, add options, set required questions — all in one place.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">◎</div>
                            <h3 className="feature-title">public & private forms</h3>
                            <p className="feature-desc">share publicly with anyone or keep it private with direct link only access.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">↗</div>
                            <h3 className="feature-title">real-time analytics</h3>
                            <p className="feature-desc">see responses as they come in with charts, option counts and participation rates.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">✉</div>
                            <h3 className="feature-title">email notifications</h3>
                            <p className="feature-desc">both you and your respondents get a copy of every submission by email.</p>
                        </div>
                    </div>
                </section>

                <footer>
                    &copy; {new Date().getFullYear()} formlogiclabs
                </footer>
            </div>
        </>
    );
}