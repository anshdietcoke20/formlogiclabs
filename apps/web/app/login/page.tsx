"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "../../trpc/client";
import Link from "next/link";

export default function LoginPage(){
    const router = useRouter();
    const [error, setError] = useState("");

    const loginMutation = trpc.auth.login.useMutation({
        onSuccess : (data:any) => {
            router.push("/dashboard")
        },
        onError: (error:any) => {
            setError(error.message)
        }
    })
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError("")

        const formData = new FormData(e.currentTarget);

        loginMutation.mutate({
            email: formData.get("email") as string,
            password: formData.get("password") as string,
        })
    }

return(
<>
<style>
    {`@import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

 html, body{
        margin:0;
        padding:0;
        overflow:hidden;
         }
    .signup-page{
    height: 100%;
    background: #ffffff;
    font-family: 'Cedarville Cursive';
    display: flex;
    flex-direction: column;
    color: #000000;
    }

    .signup-nav{
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
    }

    .sign-nav-link {
    text-decoration:none;
    color:#000000;
    }

    .signup-nav-links{
    display: flex;
    align-items:center;
    gap: 24px;
    cursor:pointer;
    }

    .signup-nav-link{
    font-size: 17px;
    color: #555555;
    text-decoration: none;
    transition: color 0.2s;
    font-family: 'Cedarville Cursive';
    }


    .signup-body{
    flex:1;
    display:flex;
    align-items:center;
    justify-content:center;
    padding:48px 20px;
    }

    .signup-card{
     width: 100%;
    max-width: 400px;
    border: 1.5px solid #e8e4dd;
    border-radius: 16px;
    padding: 40px 36px;
    }

    .card-title{
    font-size:x-large;
    font-weight:bold;
    color: #000000;
    text-align:center;
    margin-bottom:4px;
    }

    .card-subtitle{
    color:#888888;
    text-align:center;
    margin-bottom:28px;
    }
    
    .form-fields{
    margin-bottom:8px;
    }

    .form-label{
    display:block;
    font-size:small;
    color: #555555;
    margin-bottom: 6px;
    }

    .form-input{
    width:85%;
    border: 1.5px solid #e0ddd8;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: small;
    font-family: 'Cedarville Cursive';
    color:black; 
    }

    .error{
    font-size:medium;
    color: #DC143C;
    margin-bottom: 12px;
    text-align: center; 
    }

    .submit-btn{
    margin-left:105px;
    width: 50%;
    font-family: 'Cedarville Cursive';
    color: black;
    cursor:pointer;
     border-radius: 8px;
    padding: 10px 10px;
    border:transparent; 
    font-weight:500;
    margin-top: 6px;
    transition: opacity 0.3s;
    font-size:medium;
    }

    .login-link{
    text-align:center; 
    margin-top:20px;
    }

    .login-link a{
    color: black;
    text-decoration: none;
    cursor: pointer;
    }

    footer{
    text-align:center;
    font-size:20px;
    font-weight:400;
    }
    `}
</style>

<div className="signup-page">
    <nav className="signup-nav">
        < span className="logo">formlogiclabs</span>

        <div className="signup-nav-links">
            <Link href="/pricing" className="signup-nav-link ">Pricing</Link>
            <span className="sign-nav-link">Switch Theme</span>
            <Link href="/signup" className="sign-nav-link">Sign Up</Link>
        </div>
    </nav>

    <div className="signup-body">
        <div className="signup-card">
            <h2 className="card-title">Welcome Back</h2>
            <p className="card-subtitle">login to Form Logic Labs</p>

              <form onSubmit={handleSubmit}>
                <div className="form-fields">
                    <label htmlFor="email" className="form-label">email address</label>
                    <input type="text" name="email" id="email" placeholder="name@example.com" required className="form-input" />
                </div>

                  <div className="form-fields">
                    <label htmlFor="password" className="form-label">enter password</label>
                    <input type="text" name="password" id="password" placeholder="password" required className="form-input" />
                </div>

                {error && <p className="error">{error}</p>}

                <button className="submit-btn" type="submit" disabled={loginMutation.isPending}>
                    {loginMutation.isPending ? "creating account..." : "create my account"}
                </button>
              </form>

              <p className="login-link"> Don't have an account? {" "}
                <Link href="/signup">Sign Up here</Link>
              </p>
        </div>
    </div>

    <footer>&copy; formlogiclabs </footer>
</div>
        </>
    )
}