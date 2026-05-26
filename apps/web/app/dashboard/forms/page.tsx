"use client"

import { useRouter } from "next/navigation";
import { trpc } from "../../../trpc/client";

export default function FormsPage(){
    const router = useRouter();
    const {data : forms, isLoading} = trpc.forms.getForms.useQuery();
    const createForm = trpc.forms.createForm.useMutation({
        onSuccess: (form) => {
            router.push(`/dashboard/forms/${form.id}`)
        }
    })

    return (
    <>
    <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap')

          html{
          scroll-behaviour: smooth;
          }
          
          .forms-page{
          min-height: 100vh; 
          padding : 32px 40px;
          font-family:  'Cedarville Cursive';
          background: #ffffff;
          color: black;
          }

          .forms-header{
          display:flex;
          align-items:center;
          justify-content: center;
          margin-bottom: 32px;
          gap:20px;
          }

          .forms-title{
          font-size: 20px;
          font-weight:bolder;
          }

          .newForm-btn{
          padding: 10px 20px;
          background: black;
          color: white;
          border:transparent; 
        border-radius: 20px;
        font-family: 'Cedarville Cursive';
        cursor: pointer;
        transition: opacity 0.2s; 
          }

        .newForm-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        
        .forms-grid{
        display:grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 20px;
        }

        .form-card{
        border: 1px solid #e8e4dd;
        border-radius:10px;
        padding: 24px 20px;
        cursor:pointer;
        position: relative;
        overflow: hidden;
        }

        .form-card::before{
        content: '';
        position: absolute;
        inset: 0;
       opacity: 0;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='120' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
        }

        .form-card:hover::before{
        opacity:1;
        }

        .form-card-title{
        font-size:medium;
        margin-bottom: 8px;
        font-weight: 400;
        }

        .form-card-meta{
        font-size: 12px;
        display:flex;
        gap: 12px;
        }

        .form-badge{
        padding:2px 8px;
        border-radius: 20px;
        font-size: 11px;
        border: 1px solid #e8e4dd;
        color: black;
        }

      .form-badge.published {
        border-color: #000;
        color: #000;
        }

        .empty-state {
        text-align: center;
        padding: 80px 20px;
         color: #888;
        }

        .empty-state-title {
        font-size: 20px;
        color: #000;
        margin-bottom: 8px;
        }

        .empty-state-sub {
        font-size: medium;
        margin-bottom: 24px;
        }

        .loading {
        text-align: center;
        padding: 80px;
        color: #888;
        font-size: large;
        }

        `}
    </style>
    

    <div className="forms-page">
        <div className="forms-header">
            <h1 className="forms-title">Your Forms</h1>
            <button className="newForm-btn" disabled={createForm.isPending} onClick={() => createForm.mutate()}>{createForm.isPending ? "creating..." : "+ New Form"}</button>
        </div>

        {isLoading && <p className="loading"> Loading your forms...</p>}

        {!isLoading && forms?.length === 0 && (
            <div className="empty-state">
                <h2 className="empty-state-title">No forms created yet</h2>
                <p className="empty-state-sub">Create your first form to get started</p>
                <button className="newForm-btn" onClick={() => createForm.mutate()} disabled={createForm.isPending}> + Create form</button>
            </div>
        )}

         {!isLoading && forms?.length > 0 &&(
            <div className="forms-grid">
                {forms.map((form) => (
                    <div className="form-card" key={form.id} onClick={() => router.push(`/dashboard/forms/${form.id}`)}>
                        <h3 className="form-card-title">{form.title}</h3>
                        <div className="form-card-meta">
                          <span className={`form-badge ${form.isPublished ? 'published' : ''}`}> 
                            {form.isPublished ? 'Published' : 'Draft'} 
                            </span>
                            <span className="form-badge">{form.isPublic ? 'public' : 'private'}</span>
                        </div>
                    </div>
                ))}
            </div>
         )}

    </div>
    </>
    )
}
