"use client"

import { useParams, useRouter } from "next/navigation";

export default function SubmissionSuccessful() {
    const { formId } = useParams<{formId: string}>();
    const router = useRouter();

    return(
        <>
        <style>
            {`
              @import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

              .sucess-page{
              height: 100vh;
              background: white;
              font-family: 'Cedarville Cursive';
              display: flex;
              align-items:center;
              justify-content:center;
             }

             .sucess-card{
             background: black;
             color: white;
             border: 1.5px solid white
             text-align:center;
             padding: 48px 40px;
             width: 50%;
             }

             .sucess-title{
             font-size:x-large;
             font-weight: bolder;
             margin-bottom: 12px;
             }

             .sucess-title p {
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 32px;
             }

             .sucess-btn{
             padding: 12px 28px;
             background: white;
             color: black;
             font-family: 'Cedarville Cursive';
             cursor:pointer; 
             border-radius: 10px;
             }

            .success-btn:hover { opacity: 0.8; }

             @media (max-width: 600px) {
                    .success-card { padding: 32px 20px; }
                }

            
            `}
        </style>

        <div className="success-page">
            <div className="success-card">
                <h1 className="success-title">Response submitted!</h1>
                <p>gracias merci danke thankyou dhanyawad  arigatou grazie</p>
                <button className="success-btn" onClick={() => router.push("/dashboard")}> Back to home </button>
            </div>
        </div>
        </>
    )
}