"use client";

import { useRouter } from "next/navigation";
import { trpc } from "../../../../trpc/client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";


const FIELD_TYPES = [
    {value: "short-text", label: "Short Text"},
    {value: "long-text", label: "Long Text"},
    {value: "email", label: "Email"},
    {value: "number", label: "Number"},
    {value: "single_select", label: "Single Select"},
    {value: "multi_select", label: "Multi Select"},
] as const;

export default function FormBuilderPage(){
    const {formId} = useParams<{formId: string}>();
    const router=useRouter();

    const [showFieldDropDown, setShowFieldDropDown] = useState(false);
    const [editingTitle, setEditingTitle] = useState(false);
    const [titleValue, setTitleValue] = useState('');

    const utils = trpc.useUtils();

    const {data: form, isLoading} = trpc.forms.getFormById.useQuery(
        {formId})
        useEffect(() => {
             if (form) {
                setTitleValue(form.title);
             }}, [form]);


    const updateForm = trpc.forms.updateForm.useMutation({
        onSuccess: () => utils.forms.getFormById.invalidate({formId})
    })

    const publishForm = trpc.forms.publishForm.useMutation({
        onSuccess: () => utils.forms.getFormById.invalidate({formId})
    })

    const publicOrPrivate = trpc.forms.publicOrPrivate.useMutation({
        onSuccess: () =>  utils.forms.getFormById.invalidate({formId})
    })

    const addField = trpc.forms.addField.useMutation({
        onSuccess: () => {
            utils.forms.getFormById.invalidate({formId});
            setShowFieldDropDown(false);
        }
    })

    const updateField = trpc.forms.updateField.useMutation({
        onSuccess: () => utils.forms.getFormById.invalidate({ formId })
    });

    const deleteField = trpc.forms.deleteField.useMutation({
        onSuccess: () => utils.forms.getFormById.invalidate({formId})
    })

    const handleAddField = (type: string) => {
    addField.mutate({
        formId,
        type: type as "short_text" | "long_text" | "email" | "number" | "single_select" | "multi_select",
        label: `Untitled ${type.replace("_", " ")}`,
        required: false,
        order: form?.fields?.length ?? 0,
        options: [],
    });
};
 

    const handleTitleSave = () => {
        if(titleValue.trim()){
            updateForm.mutate({formId, title: titleValue});
        }
        setEditingTitle(false);
    }

    if(isLoading) return <p style={{padding: 40, fontFamily: 'Cedarville Cursive'}}>loading form...</p>
    if(!form) return <p style={{padding:40, fontFamily:'Cedarville Cursive'}}> form not found </p>

    return(
        <>
        <style>
            {`
                @import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap');

                .builder-page {
                    min-height: 100vh;
                    font-family: 'Cedarville Cursive', cursive;
                    background: #fff;
                    display: flex;
                    flex-direction: column;
                }

                .builder-topbar {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    justify-content: space-between;
                    padding: 14px 32px;
                    border-bottom: 1px solid #f0ede8;
                    flex-shrink: 0;
                    gap: 16px;
                }

                .builder-title-wrap {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    flex: 1;
                }

                .builder-title {
                    font-size: 18px;
                    font-weight: 400;
                    color: #000;
                    cursor: pointer;
                    border-bottom: 1px dashed transparent;
                    transition: border-color 0.2s;
                }

                .builder-title:hover { border-color: #ccc; }

                .builder-title-input {
                    font-size: 18px;
                    font-family: 'Cedarville Cursive', cursive;
                    color: #000;
                    border: none;
                    border-bottom: 1px solid #000;
                    outline: none;
                    background: transparent;
                    width: 240px;
                }

                .builder-actions {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .topbar-btn {
                    padding: 8px 18px;
                    border-radius: 8px;
                    font-family: 'Cedarville Cursive', cursive;
                    font-size: 13px;
                    cursor: pointer;
                    transition: opacity 0.2s;
                    border: 1.5px solid #000;
                    background: #fff;
                    color: #000;
                }

                .topbar-btn:hover { opacity: 0.7; }

                .topbar-btn.active {
                    background: #000;
                    color: #fff;
                }

                .topbar-btn.publish {
                    background: #000;
                    color: #fff;
                }

                .topbar-btn:disabled { opacity: 0.4; cursor: not-allowed; }

                .builder-body {
                    flex: 1;
                    padding: 32px 40px;
                    max-width: 680px;
                    width: 100%;
                    margin: 0 auto;
                }

                .field-card {
                    border: 1.5px solid #e8e4dd;
                    border-radius: 10px;
                    padding: 18px 20px;
                    margin-bottom: 14px;
                    position: relative;
                    transition: border-color 0.2s;
                }

                .field-card:hover { border-color: #bbb; }

                .field-top {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 10px;
                }

                .field-label-input {
                    font-family: 'Cedarville Cursive', cursive;
                    font-size: 14px;
                    color: #000;
                    border: none;
                    border-bottom: 1px dashed #ccc;
                    outline: none;
                    background: transparent;
                    width: 70%;
                }

                .field-type-tag {
                    font-size: 11px;
                    color: #888;
                    border: 1px solid #e8e4dd;
                    border-radius: 20px;
                    padding: 2px 10px;
                }

                .field-footer {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-top: 10px;
                }

                .field-required {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 12px;
                    color: #555;
                    cursor: pointer;
                }

                .field-delete {
                    margin-left: auto;
                    font-size: 12px;
                    color: #bbb;
                    cursor: pointer;
                    transition: color 0.2s;
                    background: none;
                    border: none;
                    font-family: 'Cedarville Cursive', cursive;
                }

                .field-delete:hover { color: #dc143c; }

                .add-field-wrap {
                    position: relative;
                    margin-top: 20px;
                }

                .add-field-btn {
                    padding: 10px 24px;
                    border: 1.5px dashed #ccc;
                    border-radius: 8px;
                    background: #fff;
                    font-family: 'Cedarville Cursive', cursive;
                    font-size: 14px;
                    color: #555;
                    cursor: pointer;
                    width: 100%;
                    transition: border-color 0.2s, color 0.2s;
                }

                .add-field-btn:hover { border-color: #000; color: #000; }

                .field-dropdown {
                    position: absolute;
                    top: calc(100% + 6px);
                    left: 0;
                    right: 0;
                    background: #fff;
                    border: 1.5px solid #e8e4dd;
                    border-radius: 10px;
                    overflow: hidden;
                    z-index: 20;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
                }

                .dropdown-item {
                    padding: 11px 18px;
                    font-size: 13px;
                    font-family: 'Cedarville Cursive', cursive;
                    color: #444;
                    cursor: pointer;
                    transition: background 0.15s;
                }

                .dropdown-item:hover { background: #f5f5f5; }

                .back-link {
                    font-size: 13px;
                    color: #888;
                    cursor: pointer;
                    background: none;
                    border: none;
                    font-family: 'Cedarville Cursive', cursive;
                    padding: 0;
                    transition: color 0.2s;
                }

                .back-link:hover { color: #000; }
            `}
                </style>

            <div className="builder-page">
                <div className="builder-topbar">
                    <div className="builder-title-wrap">
                        <button className="back-link" onClick={() => router.push('/dashboard/forms')}>
                            forms
                        </button>

                        <span style={{color: '#ccc'}}>/</span>
                        {editingTitle ? (
                            <input  className="builder-title-input"
                                value={titleValue}
                                onChange={(e) => setTitleValue(e.target.value)}
                                onBlur={handleTitleSave}
                                onKeyDown={(e) => e.key === "Enter" && handleTitleSave()}
                                autoFocus/>) : (
                                    <span className="builder-title" onClick={() => setEditingTitle(true)}>
                                        {form.title}
                                    </span>
                                )}
                    </div>

                    <div className="builder-actions">
                        <button className={`topbar-btn ${form.isPublic ? 'active' : ''}`} onClick={() => publicOrPrivate.mutate({formId, isPublic:true})}>Public</button>
                        <button className={`topbar-btn ${!form.isPublic ? 'active' : ''}`} onClick={() => publicOrPrivate.mutate({formId, isPublic:false})}>Private</button>
                        <button className="topbar-btn publish" onClick={() => publishForm.mutate({formId})} disabled={publishForm.isPending || form.isPublished}>{form.isPublished ? "published" : "publish"}</button>
                    </div>
                </div>

                <div className="builder-body">
                    {form.fields?.length === 0 && (
                        <p style={{color: '#aaa', fontSize:14, marginBottom:20}}>
                            No fields yet- add now!
                        </p>
                    )}

                    {form.fields?.map((field) => (
                        <div key={field.id} className="field-card">
                            <div className="field-top">
                                <input className="field-label-input" defaultValue={field.label} onBlur={(e) => updateField.mutate({
                                    fieldId: field.id,
                                    label: e.target.value
                                })} />

                                <span className="field-type-tag">{field.type.replace("_", " ")}</span>
                            </div>

                            <div className="field-footer">
                                <label className="field-required">
                                    <input type="checkbox" checked={field.required ?? false} onChange={(e) => updateField.mutate({
                                        fieldId: field.id, required: e.target.checked})} />
                                        required
                                </label>

                                <button className="field-delete" onClick={()=> deleteField.mutate({ fieldId: field.id }) }>Delete</button>
                            </div>
                        </div>
                    ))}

                    <div className="add-field-wrap">
                        <button className="add-field-btn" onClick={() => setShowFieldDropDown(!showFieldDropDown)}>
                            add field
                        </button>

                        {showFieldDropDown && (
                            <div className="field-dropdown">
                                {FIELD_TYPES.map((type) => (
                                    <div key={type.value} className="dropdown-item" onClick={() => handleAddField(type.value)}>
                                        {type.label}
                                        </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

