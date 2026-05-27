"use client";

import {useRouter} from "next/navigation";
import Link from "next/link";


 export default function DashboardPage(){
    const router = useRouter(); 

    return(
        <>
        <style>
            {`
              @import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap')

              html, body{
              margin:0;
              padding:0;
              }
              
              .hero{
              width: 100%;
              height: 100%;
              position: relative; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              overflow:hidden;
              }

              .hero-bg{
              position:absolute; 
              inset:0;
              background-image: url('https://images.unsplash.com/photo-1729783485431-c4f7b733e6d1?q=80&w=1035&auto=format&fit=crop');
              background-size: cover; 
              z-index:1;
              }

              .hero-overlay{
              position: absolute;
              inset: 0;
              background: rgba(0,0,0,0.45);
              z-index:2;
              }

              .hero-content{
              position:relative; 
              text-align:center;
              font-family: 'Cedarville Cursive'; 
              z-index:3;
              }

              .hero-title{
              font-size: 100px;
              margin-bottom: 10px;
              color: white;
               text-shadow:
                        1px 1px 0 #ddd,
                        2px 2px 0 #ccc,
                        3px 3px 0 #bbb;
             
              }

              .hero-letter{
                display:inline-block;
                 transition:
                  color 0.18s ease,
                  transform 0.18s ease,
                    text-shadow 0.18s ease;
                    }

             .hero-letter:hover{
              color:#ff69b4;
               transform:translateY(-4px) scale(1.08);
               text-shadow:0 0 12px rgba(255,105,180,0.8);
                text-shadow:
                        1px 1px 0 #ddd,
                        2px 2px 0 #ccc,
                        3px 3px 0 #bbb;
               }

              .hero-sub{
              font-size: 50px;
              margin-bottom: 20px;
               color: #f5f5f5;
              }

              .hero-btn{
              border-radius: 20px;
              padding: 10px 20px; 
              background: #000000;
              color: #ffffff;
              border: transparent;
            font-family: 'Cedarville Cursive'; 
            font-size: medium; 
            cursor: pointer; 
            }

            .hero-btn:hover{
            opacity: 0.8;
            color: hotpink;
            }

            .hero-links{
            display:flex;
            align-items:center;
            justify-content:center;
            margin-top: 20px;
            gap:40px;
            }

            .hero-links a{
            color: white;
            text-decoration: none; 
            font-size: large;
            letter-spacing:1px;
            }

            .hero-links a:hover{
            color: hotpink;
            }
              

            `}
        </style>

        <div className="hero">
            <div className="hero-bg" />
            <div className="hero-overlay" />
            <div className="hero-content">
                <h1 className="hero-title">{"Discover, Create, Enjoy".split("").map((char, index) => (
                <span  key={index} className="hero-letter" >
                     {char === " " ? "\u00A0" : char}
                      </span>))}
                </h1>
                <p className="hero-sub">build and share forms in minutes</p>
                <button className="hero-btn" onClick={() => router.push("/dashboard/forms")}>Get Set Po!</button>

                <div className="hero-links">
                    <Link href="/dashboard/forms">Create Forms </Link>
                    <Link href="/dashboard/analytics"> Analytics </Link>
                </div>

            </div>
        </div>
        </>
    )
 }