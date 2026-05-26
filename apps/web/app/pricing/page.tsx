"use client"

import Link from 'next/link';

export default function pricingPage(){
  return (
    <>

<>
<style jsx>{`
@import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

.pricing-page{
  min-height: 100vh;
  background: #ffffff;
  color: #000000;
font-family: 'Cedarville Cursive';
}

.pricing-nav{
    display:flex;
    align-items:center;
    justify-content: space-between;
    border-bottom: 1px solid  #f0ede8;
    padding: 20px 32px;
}

.logo{
    font-size:20px;
    font-weight:400;
    text-decoration:none; 
  font-family: 'Cedarville Cursive', cursive;
}

.pricing-nav-links{
  display: flex;
  align-items:center;
  gap: 28px;
  cursor:pointer;
  font-family: 'Cedarville Cursive';
}

.hero-section{
  text-align:center;
}

.hero-title{
  font-size: 56px;
  font-weight:700;
  margin-bottom:16px;
}

.hero-subtitle{
  font-size:18px;
  color:#666666;
  max-width:700px;
  margin:0 auto;
  line-height:1.6;
}

.pricing-cards{
  display:grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap:32px;
  padding: 50px 70px 90px;
}

.pricing-card{
  background:#ffffff;
  border:1px solid #ececec;
  border-radius:24px;
  padding:32px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display:flex;
  flex-direction:column;
  align-items:center;
  text-align:center;
}

.pricing-card:hover{
  transform: translateY(-8px);
  box-shadow: 0 18px 40px rgba(0,0,0,0.12);
  border:#000000 solid;
}

.plan-name{
  font-size:28px;
  font-weight:700;
  margin-bottom:12px;
}

.plan-price{
  font-size:48px;
  font-weight:700;
  margin-bottom:6px;
}

.plan-duration{
  color:#777777;
  margin-bottom:24px;
}

.plan-features{
  list-style:none;
  padding:0;
  margin:0 0 30px;
  width:100%;
}

.plan-features li{
  padding:10px 0;
  border-bottom:1px solid #f3f3f3;
  font-size:16px;
}

.plan-button{
  background:#000000;
  color:#ffffff;
  border:none;
  border-radius:999px;
  padding:14px 28px;
  font-size:16px;
  cursor:pointer;
  transition: background 0.3s ease;
  font-family:'Cedarville Cursive';
}

.plan-button:hover{
  background:#333333;
}

@media(max-width:768px){
  .pricing-nav{
    padding:20px;
  }

  .pricing-nav-links{
    gap:16px;
  }

  .hero-title{
    font-size:42px;
  }

  .pricing-cards{
    padding:40px 20px 70px;
  }
}
`}
</style>

<div className="pricing-page">
  <nav className='pricing-nav'>
    <span className="logo">formlogiclabs</span>

    <div className="pricing-nav-links">
      <Link href="/login" className="pricing-nav-link"  style={{ textDecoration: "none", color: "black" }}>Login</Link>
      <span className="pricing-nav-link">Switch Theme</span>
      <Link href="/signup" className="pricing-nav-link"  style={{ textDecoration: "none", color: "black" }}>Sign Up</Link>
    </div>
  </nav>

  <section className="hero-section">
    <h1 className="hero-title">Simple Pricing for Everyone</h1>
    <p className="hero-subtitle">
      Choose the perfect plan for your workflow. Start for free and scale as your team grow.
    </p>
  </section>

  <section className="pricing-cards">

    <div className="pricing-card">
      <h2 className="plan-name">Free</h2>
      <div className="plan-price">$0</div>
      <p className="plan-duration">Per month</p>

      <ul className="plan-features">
        <li>Basic Form Builder</li>
        <li>50 forms generation</li>
        <li>Email Support</li>
        <li>Community Access</li>
      </ul>

      <button className="plan-button">Get Started</button>
    </div>

    <div className="pricing-card popular">

      <h2 className="plan-name">Essential</h2>
      <div className="plan-price">$29</div>
      <p className="plan-duration">Per month</p>

      <ul className="plan-features">
        <li>Unlimited Forms</li>
        <li>Advanced Analytics</li>
        <li>Priority Support</li>
        <li>More templates</li>
      </ul>

      <button className="plan-button">Upgrade Now</button>
    </div>

    <div className="pricing-card">
      <h2 className="plan-name">Pro</h2>
      <div className="plan-price">$99</div>
      <p className="plan-duration">Per month</p>

      <ul className="plan-features">
        <li>Everything in Medium</li>
        <li>Dedicated Account Manager</li>
        <li>Team Collaboration</li>
        <li>24/7 Premium Support</li>
      </ul>

      <button className="plan-button">Upgrade Now</button>
    </div>

  </section>
</div>
</>
```

    </>
  )

}

