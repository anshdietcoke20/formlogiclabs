"use client";

import { useRouter } from "next/navigation";
import { trpc } from "../../../../trpc/client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {DragDropContext, Droppable, Draggable, DropResult} from "react-beautiful-dnd"


const FIELD_TYPES = [
    {value: "short_text", label: "Short Text"},
    {value: "long_text", label: "Long Text"},
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
    const[editingDesc, setEditingDesc] = useState(false);
    const [titleValue, setTitleValue] = useState('');
    const [descValue, setDescValue] = useState('');
    const [copied, setCopied] = useState(false);
    const [optionInputs, setOptionInputs] = useState<Record<string, string>>({})

    const utils = trpc.useUtils();

    useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = ""; 
    }
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
    };
}, []);

    const {data: form, isLoading} = trpc.forms.getFormById.useQuery(
        {formId})
        useEffect(() => {
             if (form) {
                setTitleValue(form.title);
                setDescValue(form.description ?? "")
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

    const handleDescSave = () => {
        updateForm.mutate({formId, description: descValue})
        setEditingDesc(false); 
    }

     const reorderFields = trpc.forms.reorderFields.useMutation({
    onSuccess: () => utils.forms.getFormById.invalidate({ formId })
     })

    const handleDragEnd = (result: DropResult) => {
        if(!result.destination || !form?.fields) return
        const items = Array.from(form.fields)
        const [moved] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, moved)
        const reordered = items.map((item, index) => ({id: item.id, order: index}))
        reorderFields.mutate(reordered);
        utils.forms.getFormById.invalidate({formId})
    }

    const handleAddOption = (fieldId: string, currentOptions: string[]) => {
    const newOption = optionInputs[fieldId]?.trim();
    if (!newOption) return;
    updateField.mutate({ fieldId, options: [...(currentOptions as string[]), newOption] });
    setOptionInputs((prev) => ({ ...prev, [fieldId]: "" }));
};


    const handleRemoveOption = (fieldId: string, currentOptions: string[], optionToRemove: string) => {
        updateField.mutate({fieldId,options: currentOptions.filter((o) => o !== optionToRemove) as string[], });
    };

    const handleCopyLink = () => {
        const url = `${window.location.origin}/forms/${formId}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
};

    if(isLoading) return <p style={{padding: 40, fontFamily: 'Cedarville Cursive'}}>loading form...</p>
    if(!form) return <p style={{padding:40, fontFamily:'Cedarville Cursive'}}> form not found </p>

    return(
        <>
        <style>
            {`
                @import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap');

                .builder-page {
                    min-height: 100vh;
                    font-family: 'Cedarville Cursive';
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
                    font-family: 'Cedarville Cursive';
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
                    font-family: 'Cedarville Cursive';
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
                    padding: 32px 20px;
                    max-width: 700px;
                    width: 100%;
                    margin: 0 auto;
                }

                 .form-meta {
                    background: #fff;
                    border: 1.5px solid #e8e4dd;
                    border-radius: 12px;
                    padding: 24px;
                    margin-bottom: 24px;
                }

                .form-meta-title {
                    font-size: 22px;
                    color: #000;
                    border: none;
                    outline: none;
                    width: 100%;
                    font-family: 'Cedarville Cursive';
                    border-bottom: 1px dashed #ddd;
                    padding-bottom: 8px;
                    margin-bottom: 12px;
                    background: transparent;
                }

                 .form-meta-desc {
                    font-size: 14px;
                    color: #555;
                    border: none;
                    outline: none;
                    width: 100%;
                    font-family: 'Cedarville Cursive';
                    resize: none;
                    background: transparent;
                    min-height: 60px;
                }

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

                 .drag-handle {
                    color: #ccc;
                    cursor: grab;
                    font-size: 16px;
                    flex-shrink: 0;
                    user-select: none;
                }

                .drag-handle:active { cursor: grabbing; }

                .field-label-input {
                    font-family: 'Cedarville Cursive';
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
                    font-family: 'Cedarville Cursive';
                }

                .field-delete:hover { color: #dc143c; }

                .options-section {
                    margin-top: 12px;
                    padding-top: 12px;
                    border-top: 1px dashed #e8e4dd;
                }

                .options-label {
                    font-size: 12px;
                    color: #888;
                    margin-bottom: 8px;
                }

                 .option-tag {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 4px 10px;
                    border: 1px solid #e8e4dd;
                    border-radius: 20px;
                    font-size: 12px;
                    color: #444;
                    margin: 3px;
                }
                    
                .option-remove {
                    cursor: pointer;
                    color: #bbb;
                    background: none;
                    border: none;
                    font-size: 14px;
                    line-height: 1;
                    padding: 0;
                    transition: color 0.2s;
                }

                .option-remove:hover { color: #dc143c; }

                .option-add-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-top: 8px;
                    flex-wrap: wrap;
                }

                 .option-input {
                    font-family: 'Cedarville Cursive';
                    font-size: 13px;
                    border: 1px solid #e0ddd8;
                    border-radius: 8px;
                    padding: 6px 10px;
                    outline: none;
                    flex: 1;
                    min-width: 120px;
                }

                .option-add-btn {
                    padding: 6px 14px;
                    background: #000;
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    font-family: 'Cedarville Cursive';
                    font-size: 12px;
                    cursor: pointer;
                    white-space: nowrap;
                }

                .add-field-wrap {
                    position: relative;
                    margin-top: 20px;
                }

                .add-field-btn {
                    padding: 10px 24px;
                    border: 1.5px dashed #ccc;
                    border-radius: 8px;
                    background: #fff;
                    font-family: 'Cedarville Cursive';
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
                    font-family: 'Cedarville Cursive';
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
                    font-family: 'Cedarville Cursive';
                    padding: 0;
                    transition: color 0.2s;
                }

                .back-link:hover { color: #000; }

                .select-type-toggle {
                display: flex;
             gap: 8px;
             margin-bottom: 12px;
             }

.toggle-btn {
    padding: 5px 14px;
    border-radius: 20px;
    font-family: 'Cedarville Cursive', cursive;
    font-size: 12px;
    cursor: pointer;
    border: 1.5px solid #e8e4dd;
    background: #fff;
    color: #555;
    transition: all 0.2s;
}

.toggle-btn.active {
    background: #000;
    color: #fff;
    border-color: #000;
}

.toggle-btn:hover:not(.active) {
    border-color: #000;
    color: #000;
}

                  @media (max-width: 600px) {
                    .builder-topbar { padding: 12px 16px; }
                    .builder-body { padding: 20px 12px; }
                    .builder-actions { gap: 6px; }
                    .topbar-btn { padding: 6px 12px; font-size: 12px; }
                }
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
                <div className="form-meta">
                    <input className="form-meta-title" onChange={(e) => setTitleValue(e.target.value)} value={titleValue} placeholder="Form title goes here" />
                    <textarea className="form-meta-desc" value = {descValue} onChange={(e) => setDescValue(e.target.value)} onBlur={handleDescSave} placeholder="Form Description"/>
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="fields" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping= {false}>
                        {(provided) => (
                            <div {...provided.droppableProps} ref= {provided.innerRef}>
                                {form.fields?.length === 0 && ( <p style = {{color: "#aaa", fontSize: 14, marginBottom:16, textAlign:"center"}}>
                                    No fields yet - add now!
                                </p>)}

                                {form.fields?.map((field, index) => (
                                    <Draggable key={field.id} draggableId={field.id} index={index}>
                                        {(provided,snapshot) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} className={`field-card ${snapshot.isDragging ? "dragging" : ""}`}>
                                                <div className="field-top">
                                                    <span className="drag-handle" {...provided.dragHandleProps}>::</span>
                                                    <input className="field-label-input" defaultValue={field.label} onBlur={(e) => updateField.mutate({fieldId: field.id, label: e.target.value})} placeholder="Enter question here"/> Q.
                                                    <span className="field-type-tag">{field.type.replace(/_/g, " ")}</span>
                                                </div>

                                                {(field.type === "single_select" || field.type === "multi_select") && (
                                                    <div className="options-select">
                                                        <div className="select-type-toggle">
                                                            <button
                                className={`toggle-btn ${field.type === "single_select" ? "active" : ""}`}
                                onClick={() => updateField.mutate({ fieldId: field.id, type: "single_select" })}>single choice</button>
                        
                                  <button   className={`toggle-btn ${field.type === "multi_select" ? "active" : ""}`}
                                onClick={() => updateField.mutate({ fieldId: field.id, type: "multi_select" })}> multiple choice</button>
                                </div>
                                                        <p className="options-label">Options:</p>
                                                         <div>
                                                                {((field.options as string[]) ?? []).map((opt, optIndex) => (
                                                                    <div key={optIndex} className="option-tag">
                                                                       <span>{opt}</span> 
                                                                        <button
                                                                            className="option-remove"
                                                                            onClick={() => handleRemoveOption(field.id, field.options as string[], opt)}
                                                                        ><i className="ri-close-line"></i> </button>
                                                                    </div>
                                                                ))}
                                                                 </div>

                                                                <div className="option-add-row">
                                                                    <input placeholder="Add options here" className="option-input" value={optionInputs[field.id] ?? ""}
                                                                     onChange={(e) => setOptionInputs((prev) => ({...prev, [field.id]: e.target.value}))} 
                                                                     onKeyDown={(e) => e.key === "Enter" && handleAddOption(field.id, field.options as string[])}/>

                                                                    <button className="option-add-btn" onClick={() => handleAddOption(field.id, field.options as string[])}> 
                                                                        add
                                                                    </button>
                                                                </div>
                                                                </div>
                                                                )}
                                                     <div className="field-footer">
                                                        <label className="field-required">
                                                            <input
                                                                type="checkbox"
                                                                checked={field.required ?? false}
                                                                onChange={(e) => updateField.mutate({ fieldId: field.id, required: e.target.checked })}
                                                            />
                                                            required
                                                        </label>
                                                        <button className="field-delete" onClick={() => deleteField.mutate({ fieldId: field.id })}>
                                                            delete
                                                        </button>
                                                    </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

                    <div className="add-field-wrap">
                        <button className="add-field-btn" onClick={() => setShowFieldDropDown(!showFieldDropDown)}>
                            + add field
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
