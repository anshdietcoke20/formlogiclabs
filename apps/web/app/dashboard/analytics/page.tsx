"use client"

import { useRouter } from "next/navigation";
import {trpc} from "../../../trpc/client";

export default function AnalyticsPage(){
    const router= useRouter();
    const {data: forms, isLoading } = trpc.submission.getAllFormsAnalytics.useQuery();
    
    return (
        <>
        <style>
            {`

             @import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap');

                * { box-sizing: border-box; }

                .analytics-page {
                    min-height: 100%;
                    padding: 32px 40px;
                    font-family: 'Cedarville Cursive';
                    background: #fff;
                }

                .analytics-header {
                    margin-bottom: 32px;
                }

                .analytics-title {
                    font-size: 24px;
                    font-weight: 400;
                    color: #000;
                }

                .analytics-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
                    gap: 20px;
                }
                
                .analytics-card {
                    border: 1.5px solid #e8e4dd;
                    border-radius: 12px;
                    padding: 24px;
                    cursor: pointer;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }

                .analytics-card:hover {
                    border-color: #000;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
                }

                .analytics-card-title {
                    font-size: 16px;
                    color: #000;
                    margin-bottom: 16px;
                }

                .analytics-stat {
                    display: flex;
                    align-items: baseline;
                    gap: 6px;
                    margin-bottom: 10px;
                }

                .analytics-stat-number {
                    font-size: 32px;
                    color: #000;
                    font-weight: 400;
                }

                .analytics-stat-label {
                    font-size: 13px;
                    color: #888;
                }

                .analytics-badges {
                    display: flex;
                    gap: 8px;
                    margin-top: 12px;
                    flex-wrap: wrap;
                }

                .badge {
                    padding: 2px 10px;
                    border-radius: 20px;
                    font-size: 11px;
                    border: 1px solid #e8e4dd;
                    color: #555;
                }

                .badge.published {
                    border-color: #000; color: #000;
                 }

                .empty-state {
                    text-align: center;
                    padding: 80px 20px;
                    color: #888;
                }

                .loading {
                    text-align: center;
                    padding: 80px;
                    color: #888;
                }

                @media (max-width: 600px) {
                    .analytics-page { padding: 20px 16px; }
                }            
            `}
        </style>

        <div className="analytics-page">
            <div className="analytics-header">
                <h1 className="analytics-title">Results</h1>
            </div>

            {isLoading && <p className="loading">Loading...</p>}

            {!isLoading && forms.length === 0 && (
                <div className="empty-stats">No forms yet - start creating now to see results!!</div>
            )}

            {!isLoading && forms && forms.length > 0 && (
                <div className="analytics-grid">
                    {forms.map((form) => (
                        <div className="analytics-card"
                        key= {form.id}
                        onClick={() => router.push(`/dashboard/analytics/${form.id}`)}>

                       <h3 className="analytics-card-title">{form.title}</h3>     
                       <div className="analytics-stat">
                        <span className="analytics-stat-number">{form.totalResponses}</span>
                        <span className="analytics-stat-label">Responses</span>
                       </div>

                       <div className="analytics-badges">
                        <span className={`badge ${form.isPublished ? "published" : "private"}`}></span>
                       </div>

                        </div>
                ))}
                </div>
            )}
        </div>
        </>
    )
}