"use client"; 

import { useParams, useRouter } from "next/navigation";
import { trpc } from "../../../../trpc/client";

export default function FormAnslyticsPage() {
    const router= useRouter();

    const {formId} = useParams<{formId: string}>();
    const {data, isLoading} = trpc.submission.getFormAnalytics.useQuery({formId});

     if(isLoading) return (
        <div style={{padding: 40, fontFamily: "Cedarville Cursive", color: "black",textAlign:"center"}}>
            Loading results...
        </div>
     )

     if(!data) return(
         <div style={{padding: 40, fontFamily: "Cedarville Cursive", color: "black",textAlign:"center"}}>
            No data found.
        </div>
     )
     return(
        <>
        <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap');

                * { box-sizing: border-box; }

                .fa-page {
                    min-height: 100%;
                    padding: 32px 40px;
                    font-family: 'Cedarville Cursive';
                    background: white;
                }

                .fa-back {
                    background: #fff;
                    border: 1.5px solid #e8e4dd;
                    border-bottom: 3px solid #cccccc;
                    font-family: 'Cedarville Cursive';
                    font-size: 13px;
                    color: gray;
                    cursor: pointer;
                    padding: 6px 16px;
                    margin-bottom: 24px;
                    display: inline-block;
                    border-radius: 8px;
                }

                .fa-back:hover {
                    border-bottom-width: 1px;
                    transform: translateY(2px);
                    color: hotpink;
                }

                .fa-back:active {
                    border-bottom-width: 1px;
                    transform: translateY(3px);
                }

                .fa-title {
                    font-size: 28px;
                    font-weight: 400;
                    color: #000;
                    margin-bottom: 6px;
                    text-shadow:
                        1px 1px 0 #ccc,
                        2px 2px 0 #bbb,
                        3px 3px 0 #aaa;
                    letter-spacing: 0.5px;
                }

                .fa-desc {
                    font-size: 13px;
                    color: #888;
                    margin-bottom: 28px;
                }

                .stats-row {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                    gap: 16px;
                    margin-bottom: 32px;
                }

                .stat-card {
                    background: #fff;
                    border: 1.5px solid #e8e4dd;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow:
                        0 4px 0 #d4d0ca,
                        0 6px 12px rgba(0,0,0,0.08);
                    transition: all 0.15s;
                    cursor: default;
                }

                .stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow:
                        0 6px 0 #d4d0ca,
                        0 10px 20px rgba(0,0,0,0.1);
                }

                .stat-number {
                    font-size: 36px;
                    color: #000;
                    text-shadow: 1px 1px 0 #ddd, 2px 2px 0 #ccc;
                }

                .stat-label {
                    font-size: 12px;
                    color: #888;
                    margin-top: 4px;
                }

                .section-title {
                    font-size: 18px;
                    color: #000;
                    margin-bottom: 16px;
                    padding-bottom: 8px;
                    border-bottom: 2px solid #000;
                    text-shadow: 1px 1px 0 #ccc, 2px 2px 0 #bbb;
                }

                .chart-section {
                    background: #fff;
                    border: 1.5px solid #e8e4dd;
                    border-radius: 12px;
                    padding: 24px;
                    margin-bottom: 28px;
                    box-shadow: 0 4px 0 #d4d0ca, 0 6px 12px rgba(0,0,0,0.06);
                }

                .chart-bars {
                    display: flex;
                    align-items: flex-end;
                    gap: 8px;
                    height: 120px;
                    overflow-x: auto;
                    padding-bottom: 4px;
                }

                .chart-bar-wrap {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    flex-shrink: 0;
                }

                .chart-bar {
                    width: 28px;
                    background: linear-gradient(to bottom, #333, #000);
                    border-radius: 4px 4px 0 0;
                    min-height: 4px;
                    box-shadow: 2px 0 0 #555, -1px 0 0 #222;
                    position: relative;
                }

                .chart-bar-count {
                    position: absolute;
                    top: -20px;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 10px;
                    color: #555;
                    white-space: nowrap;
                }

                .chart-bar-label {
                    font-size: 9px;
                    color: #888;
                    transform: rotate(-45deg);
                    white-space: nowrap;
                }

                .field-section {
                    background: #fff;
                    border: 1.5px solid #e8e4dd;
                    border-radius: 12px;
                    padding: 24px;
                    margin-bottom: 20px;
                    box-shadow: 0 4px 0 #d4d0ca, 0 6px 12px rgba(0,0,0,0.06);
                }

                .field-q {
                    font-size: 16px;
                    color: #000;
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    flex-wrap: wrap;
                }

                .field-type-badge {
                    font-size: 11px;
                    color: #888;
                    border: 1px solid #e8e4dd;
                    border-radius: 20px;
                    padding: 2px 10px;
                }

                .field-response-count {
                    font-size: 11px;
                    color: #aaa;
                    margin-left: auto;
                }

                .option-bar-row {
                    margin-bottom: 14px;
                }

                .option-bar-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 6px;
                }

                .option-bar-name {
                    font-size: 13px;
                    color: #333;
                }

                .option-bar-stats {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .option-bar-count {
                    font-size: 13px;
                    color: #555;
                }

                .option-bar-pct {
                    font-size: 13px;
                    color: #000;
                    font-weight: 500;
                    min-width: 40px;
                    text-align: right;
                }

                .option-bar-track {
                    height: 10px;
                    background: #f0ede8;
                    border-radius: 6px;
                    overflow: visible;
                    position: relative;
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.08);
                }

                .option-bar-fill {
                    height: 100%;
                    background: linear-gradient(to right, #333, #000);
                    border-radius: 6px;
                    transition: width 0.5s ease;
                    position: relative;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }

                .option-bar-fill::after {
                    content: '';
                    position: absolute;
                    top: 1px;
                    left: 4px;
                    right: 4px;
                    height: 3px;
                    background: rgba(255,255,255,0.3);
                    border-radius: 3px;
                }

                .text-answer-row {
                    margin-bottom: 12px;
                }

                .text-answer {
                    padding: 10px 14px;
                    background: #fafaf9;
                    border: 1px solid #e8e4dd;
                    border-radius: 8px;
                    font-size: 13px;
                    color: #444;
                    margin-bottom: 4px;
                }

                .text-answer-bar-track {
                    height: 4px;
                    background: #f0ede8;
                    border-radius: 4px;
                    overflow: hidden;
                }

                .text-answer-bar-fill {
                    height: 100%;
                    background: #ccc;
                    border-radius: 4px;
                    transition: width 0.5s ease;
                }

                .participation-section {
                    background: #fff;
                    border: 1.5px solid #e8e4dd;
                    border-radius: 12px;
                    padding: 24px;
                    margin-bottom: 28px;
                    box-shadow: 0 4px 0 #d4d0ca, 0 6px 12px rgba(0,0,0,0.06);
                }

                .participation-bar-track {
                    height: 16px;
                    background: #f0ede8;
                    border-radius: 8px;
                    overflow: hidden;
                    margin-top: 12px;
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.08);
                }

                .participation-bar-fill {
                    height: 100%;
                    background: linear-gradient(to right, #555, #000);
                    border-radius: 8px;
                    transition: width 0.6s ease;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    padding-right: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }

                .participation-bar-label {
                    font-size: 11px;
                    color: #fff;
                    white-space: nowrap;
                }

                .participation-stats {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 10px;
                    font-size: 12px;
                    color: #888;
                }

                .no-answers {
                    font-size: 13px;
                    color: #aaa;
                    text-align: center;
                    padding: 20px;
                }

                .fa-publish-btn {
                    padding: 8px 20px;
                    background: #000;
                    color: #fff;
                    border: none;
                    border-bottom: 4px solid #333;
                    border-radius: 8px;
                    font-family: 'Cedarville Cursive', cursive;
                    font-size: 13px;
                    cursor: pointer;
                    transition: all 0.15s;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                }

                .fa-publish-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 12px rgba(0,0,0,0.25);
                }

                .fa-publish-btn:active {
                    transform: translateY(3px);
                    border-bottom-width: 1px;
                    box-shadow: none;
                }

                @media (max-width: 600px) {
                    .fa-page { padding: 20px 16px; }
                    .stats-row { grid-template-columns: repeat(2, 1fr); }
                    .fa-title { font-size: 22px; }
                }


        `}
        </style>

        <div className="fa-page">
            <button className="fa-back" onClick={() => router.push("/dashboard/analytics")}>
                <i className="ri-arrow-drop-left-line"></i>Responses
            </button>

            <h1 className="fa-title">{data.form.title}</h1>
            <p className="fa-desc">{data.form.description ?? ""}</p>

            <div className="stats-row">
                    <div className="stat-card">
                        <div className="stat-number">{data.totalResponses}</div>
                        <div className="stat-label">Total Responses</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{data.perField.length}</div>
                        <div className="stat-label">Questions</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{data.form.isPublished ? "live" : "draft"}</div>
                        <div className="stat-label">Status</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{data.form.isPublic ? "open" : "closed"}</div>
                        <div className="stat-label">Visibility</div>
                    </div>
                </div>
                
                <div className="participation-section">
                    <h2 className="section-title">overall participation</h2>
                    {data.perField.map((field) => {
                        const answered = field.answers.filter((a) => a && a.trim() !== "").length;
                        const pct = data.totalResponses > 0 ? Math.round((answered / data.totalResponses) * 100) : 0;
                        return (
                            <div key={field.fieldId} style={{ marginBottom: 16 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#444", marginBottom: 6 }}>
                                    <span>{field.label}</span>
                                    <span style={{ color: "#888" }}>{answered}/{data.totalResponses} answered</span>
                                </div>
                                <div className="option-bar-track">
                                    <div className="option-bar-fill" style={{ width: `${pct}%` }}>
                                        <div className="option-bar-fill::after" />
                                    </div>
                                </div>
                                <div style={{ fontSize: 11, color: "#aaa", marginTop: 3, textAlign: "right" }}>{pct}% response rate</div>
                            </div>
                        );
                    })}
                    {data.perField.length === 0 && <p className="no-answers">no questions in this form</p>}
                </div>

<h2 className="section-title" style={{ marginBottom: 20 }}>question breakdown</h2>

                {data.perField.map((field) => {
                    const answered = field.answers.filter((a) => a && a.trim() !== "").length;
                    const responseRate = data.totalResponses > 0
                        ? Math.round((answered / data.totalResponses) * 100)
                        : 0;

                    return (
                        <div key={field.fieldId} className="field-section">
                            <p className="field-q">
                                {field.label}
                                <span className="field-type-badge">{field.type.replace(/_/g, " ")}</span>
                                <span className="field-response-count">{answered} responses</span>
                            </p>

                             <div style={{ marginBottom: 16 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#888", marginBottom: 4 }}>
                                    <span>response rate</span>
                                    <span>{responseRate}%</span>
                                </div>
                                <div className="option-bar-track">
                                    <div className="option-bar-fill" style={{ width: `${responseRate}%` }} />
                                </div>
                            </div>

                            {(field.type === "single_select" || field.type === "multi_select") && (
                                <div>
                                    {Object.entries(field.optionCounts).length === 0 && (
                                        <p className="no-answers">no responses yet</p>
                                    )}
                                    {Object.entries(field.optionCounts)
                                        .sort(([, a], [, b]) => (b as number) - (a as number))
                                        .map(([option, count]) => {
                                            const numCount = count as number;
                                            const pct = data.totalResponses > 0
                                                ? Math.round((numCount / data.totalResponses) * 100)
                                                : 0;
                                            return (
                                                <div key={option} className="option-bar-row">
                                                    <div className="option-bar-header">
                                                        <span className="option-bar-name">{option}</span>
                                                        <div className="option-bar-stats">
                                                            <span className="option-bar-count">{numCount} responses</span>
                                                            <span className="option-bar-pct">{pct}%</span>
                                                        </div>
                                                    </div>
                                                    <div className="option-bar-track">
                                                        <div className="option-bar-fill" style={{ width: `${pct}%` }} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            )}
                            {field.type !== "single_select" && field.type !== "multi_select" && (
                                <div>
                                    {field.answers.length === 0 && <p className="no-answers">no responses yet</p>}
                                    {field.answers.map((ans, i) => (
                                        <div key={i} className="text-answer-row">
                                            <div className="text-answer">{ans}</div>
                                            <div className="text-answer-bar-track">
                                                <div
                                                    className="text-answer-bar-fill"
                                                    style={{ width: `${Math.max(10, (1 / field.answers.length) * 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
}
