"use client"

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { trpc } from "../../../trpc/client";

export default function PublicFormPage() {
  const {formId} = useParams<{formId:string}>();
  const router = useRouter();

    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitError, setSubmitError] = useState("");

    const { data: form, isLoading, error } = trpc.submission.getPublicForm.useQuery({ formId });

    useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = ""; 
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
    };
}, []);

    const submitForm = trpc.submission.submitForm.useMutation({
        onSuccess: () => {
            router.push(`/forms/${formId}/success`);
        },
        onError: (e) => {
            if(e.message?. includes("Rate limit exceeded")){
                setSubmitError("You have submitted too many times, wait for some time.")
            } else{
                setSubmitError(e.message)
            }
        },
    });

    const handleChange = (fieldId: string, value: string) => {
        setAnswers((prev) => ({ ...prev, [fieldId]: value }));
        setErrors((prev) => ({ ...prev, [fieldId]: "" }));
    };

    const handleMultiSelect = (fieldId: string, option: string, checked: boolean) => {
        const current = answers[fieldId] ? answers[fieldId].split(",").map((v) => v.trim()).filter(Boolean) : [];
        const updated = checked ? [...current, option] : current.filter((v) => v !== option);
        handleChange(fieldId, updated.join(", "));
    };

    const handleSubmit = () => {
        if (!email) { setSubmitError("Please enter your email"); return; }
        const newErrors: Record<string, string> = {};
        form?.fields?.forEach((field) => {
            if (field.required && !answers[field.id]) {
                newErrors[field.id] = "This field is required";
            }
        });
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

        submitForm.mutate({
            formId,
            submitterEmail: email,
            answers: Object.entries(answers).map(([fieldId, value]) => ({ fieldId, value })),
        });
    };

    if (isLoading) return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "Cedarville Cursive" }}>
            loading form...
        </div>
    );

    if (error || !form) return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "Cedarville Cursive" }}>
            form not found or not published yet
        </div>
    );

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap');

                * { box-sizing: border-box; margin: 0; padding: 0; }

                .public-page {
                    min-height: 100vh;
                    background: #fafaf9;
                    font-family: 'Cedarville Cursive;
                    padding: 40px 20px;
                }

                .public-form {
                    max-width: 640px;
                    margin: 0 auto;
                }

                .form-header {
                    background: #fff;
                    border: 1.5px solid #e8e4dd;
                    border-top: 4px solid #000;
                    border-radius: 12px;
                    padding: 28px 28px 24px;
                    margin-bottom: 20px;
                }

                .form-header-title {
                    font-size: 26px;
                    font-weight: 400;
                    color: #000;
                    margin-bottom: 10px;
                }

                .form-header-desc {
                    font-size: 14px;
                    color: #666;
                    line-height: 1.6;
                }

                .form-badge {
                    display: inline-block;
                    margin-top: 12px;
                    padding: 3px 10px;
                    border-radius: 20px;
                    font-size: 11px;
                    border: 1px solid #e8e4dd;
                    color: #888;
                }

                .email-card {
                    background: #fff;
                    border: 1.5px solid #e8e4dd;
                    border-radius: 10px;
                    padding: 20px;
                    margin-bottom: 16px;
                }

                .email-label {
                    font-size: 14px;
                    color: #000;
                    display: block;
                    margin-bottom: 8px;
                }

                .email-req {
                    color: #dc143c;
                    margin-left: 2px;
                }

                .field-card {
                    background: #fff;
                    border: 1.5px solid #e8e4dd;
                    border-radius: 10px;
                    padding: 20px;
                    margin-bottom: 16px;
                    transition: border-color 0.2s;
                }

                .field-card:focus-within { border-color: #000; }
                .field-card.has-error { border-color: #dc143c; }

                .field-label {
                    font-size: 15px;
                    color: #000;
                    display: block;
                    margin-bottom: 12px;
                }

                .field-required-star {
                    color: #dc143c;
                    margin-left: 2px;
                }

                .text-input {
                    width: 100%;
                    border: 1px solid #e0ddd8;
                    border-radius: 8px;
                    padding: 10px 14px;
                    font-family: 'Cedarville Cursive';
                    font-size: 14px;
                    color: #000;
                    outline: none;
                    transition: border-color 0.2s;
                    background: #fafaf9;
                }

                .text-input:focus { border-color: #000; background: #fff; }

                textarea.text-input {
                    min-height: 100px;
                    resize: vertical;
                }

                .radio-option, .checkbox-option {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 14px;
                    border: 1px solid #e8e4dd;
                    border-radius: 8px;
                    margin-bottom: 8px;
                    cursor: pointer;
                    transition: border-color 0.2s, background 0.2s;
                    font-size: 14px;
                    color: #444;
                }

                .radio-option:hover, .checkbox-option:hover { border-color: #000; background: #fafaf9; }

                .radio-option.selected, .checkbox-option.selected {
                    border-color: #000;
                    background: #f5f5f5;
                    color: #000;
                }

                .field-error {
                    font-size: 12px;
                    color: #dc143c;
                    margin-top: 6px;
                }

                .submit-section {
                    margin-top: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .submit-btn {
                    padding: 14px 32px;
                    background: #000;
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    font-family: 'Cedarville Cursive';
                    font-size: 15px;
                    cursor: pointer;
                    width: 100%;
                    transition: opacity 0.2s;
                }

                .submit-btn:hover { opacity: 0.8; }
                .submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }

                .submit-error {
                    font-size: 13px;
                    color: #dc143c;
                    text-align: center;
                }

                @media (max-width: 600px) {
                    .public-page { padding: 20px 12px; }
                    .form-header { padding: 20px; }
                    .form-header-title { font-size: 20px; }
                }
            `}</style>

            <div className="public-page">
                <div className="public-form">
                    <div className="form-header">
                        <h1 className="form-header-title">{form.title}</h1>
                        {form.description && <p className="form-header-desc">{form.description}</p>}
                        <span className="form-badge">{form.isPublic ? "public form" : "private form"}</span>
                    </div>

                  
                    <div className="email-card">
                        <label className="email-label">
                            your email <span className="email-req">*</span>
                        </label>
                        <input
                            className="text-input"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {form.fields?.map((field) => (
                        <div key={field.id} className={`field-card ${errors[field.id] ? "has-error" : ""}`}>
                            <label className="field-label">
                                {field.label}
                                {field.required && <span className="field-required-star">*</span>}
                            </label>

                            {field.type === "short_text" && (
                                <input
                                    className="text-input"
                                    type="text"
                                    placeholder={field.placeholder ?? "your answer"}
                                    value={answers[field.id] ?? ""}
                                    onChange={(e) => handleChange(field.id, e.target.value)}
                                />
                            )}

                            {field.type === "long_text" && (
                                <textarea
                                    className="text-input"
                                    placeholder={field.placeholder ?? "your answer"}
                                    value={answers[field.id] ?? ""}
                                    onChange={(e) => handleChange(field.id, e.target.value)}
                                />
                            )}

                            {field.type === "email" && (
                                <input
                                    className="text-input"
                                    type="email"
                                    placeholder={field.placeholder ?? "name@example.com"}
                                    value={answers[field.id] ?? ""}
                                    onChange={(e) => handleChange(field.id, e.target.value)}
                                />
                            )}

                            {field.type === "number" && (
                                <input
                                    className="text-input"
                                    type="number"
                                    placeholder={field.placeholder ?? "0"}
                                    value={answers[field.id] ?? ""}
                                    onChange={(e) => handleChange(field.id, e.target.value)}
                                />
                            )}

                            {field.type === "single_select" && (
                                <div>
                                    {((field.options as string[]) ?? []).map((opt) => (
                                        <div
                                            key={opt}
                                            className={`radio-option ${answers[field.id] === opt ? "selected" : ""}`}
                                            onClick={() => handleChange(field.id, opt)}
                                        >
                                            <input
                                                type="radio"
                                                checked={answers[field.id] === opt}
                                                onChange={() => handleChange(field.id, opt)}
                                            />
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {field.type === "multi_select" && (
                                <div>
                                    {((field.options as string[]) ?? []).map((opt) => {
                                        const selected = answers[field.id]?.split(",").map((v) => v.trim()).includes(opt);
                                        return (
                                            <div
                                                key={opt}
                                                className={`checkbox-option ${selected ? "selected" : ""}`}
                                                onClick={() => handleMultiSelect(field.id, opt, !selected)}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selected ?? false}
                                                    onChange={(e) => handleMultiSelect(field.id, opt, e.target.checked)}
                                                />
                                                {opt}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {errors[field.id] && <p className="field-error">{errors[field.id]}</p>}
                        </div>
                    ))}

                    <div className="submit-section">
                        {submitError && <p className="submit-error">{submitError}</p>}
                        <button
                            className="submit-btn"
                            onClick={handleSubmit}
                            disabled={submitForm.isPending}
                        >
                            {submitForm.isPending ? "Handing in..." : "Hand in"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}