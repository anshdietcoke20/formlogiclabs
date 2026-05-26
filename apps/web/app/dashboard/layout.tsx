"use client";

import { useState } from "react";
import Link from "next/link";

 export default function DashboardLayout({
  children,}: { children: React.ReactNode;}) {

    const [collapsed, setCollapsed] = useState(false)

    return(
        <>
        <style>
            {`
            @import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

            html, body{
              margin:0;
              padding:0;
              overflow:hidden;
              }
              
            .dashboard{
            display:flex;
            flex-direction:column;
            height: 100vh;
            font-family: 'Cedarville Cursive';
            color: #000000;
            overflow:hidden;
            }

            .db-nav{
             display:flex;
             align-items:center;
             justify-content: space-between;
             border-bottom: 1px solid  #f0ede8;
             padding: 20px 32px;
             z-index:100;
             position:fixed;
             top:0;
             left:0;
             right: 0;
             backdrop-filter: blur(8px);
            background: white;
            border-bottom: 1px solid #f0ede8;
            }

             .logo{
             color:black;
             font-size:20px;
             font-weight:400;
             text-decoration:none; 
             }

             .db-nav-links{
              display: flex;
              align-items:center;
              gap: 24px;
              cursor:pointer;
            }

            .db-nav-link{
            font-size: 17px;
             color:black ;
             text-decoration: none;
             transition: color 0.2s;
              font-family: 'Cedarville Cursive';
            }

            .db-body{
            display:flex;
            flex:1;
            overflow:hidden;
            padding: 61px;
            }

            .db-main {
            flex: 1;
            overflow-y: auto;
            }

            `}
        </style>

        <div className="dashboard">
            <nav className="db-nav">
                 <span className="logo">formlogiclabs</span>

                 <div className="db-nav-links">
                    <Link href="/pricing" className="db-nav-link ">Pricing</Link>
                   <span className="db-nav-link">Switch Theme</span>
                   <Link href="/signup" className="db-nav-link ">Sign Up</Link>
                 </div>
            </nav>

            <div className="db-body">
                <div className="db-main">{children}</div>
            </div>
        </div>
        </>
    )
}