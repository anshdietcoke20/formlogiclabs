
import { asc, db } from "@repo/database";
import { eq } from "@repo/database";
import {TRPCError} from "@trpc/server";
import { formsTable, fieldsTable } from "@repo/database/schema";
import type { FieldType } from "@repo/database/schema";

export const formService = {
    async createForm(userId: string){
        const form = await db.insert(formsTable).values({
            title: "Untitle Form", 
            userId,
        }).returning();

        return form[0]
    },

    async getForms(userId:string){
        const forms = await db.select().from(formsTable).where(eq(formsTable.userId, userId))

        return forms; 
    },

    async getFormById(formId:string, userId:string){
        const form = await db.select().from(formsTable).where((eq(formsTable.id, formId), eq(formsTable.userId, userId)))

        if(form.length === 0){
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Form not found"
            })
        }

        const fields = await db.select().from(fieldsTable).where(eq(fieldsTable.formId, formId)).orderBy(asc(fieldsTable.order))

        return{...form[0], fields}
    }, 

    async updateForm(formId:string, userId:string, input:{title:string}){
        const form = await db.update(formsTable)
        .set({title:input.title})
        .where((eq(formsTable.id, formId),
    eq(formsTable.userId, userId))).returning()

     if(form.length === 0){
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Form not found"
            })
        }
        return form[0]
    },

    async publishForm(formId: string, userId:string){
         const form = await db.update(formsTable)
        .set({isPublished: true})
        .where((eq(formsTable.id, formId),
    eq(formsTable.userId, userId))).returning()

      if(form.length === 0){
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Form not found"
            })
        }
        return form[0]
    },

    async publicOrPrivate(formId:string, userId:string, isPublic: boolean){
          const form = await db.update(formsTable)
        .set({isPublic})
        .where((eq(formsTable.id, formId),
    eq(formsTable.userId, userId))).returning()

      if(form.length === 0){
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Form not found"
            })
        }
        return form[0]
    }, 

    async deleteForm(formId:string, userId:string){
        const form = await db.delete(formsTable)
        .where((eq(formsTable.id, formId),
        eq(formsTable.userId, userId))).returning()

        if(form.length === 0){
            throw new TRPCError({
                code: "NOT_FOUND",
                message:"Form not found"
            })
        }
        return form[0]
    }, 

    async addField(formId:string, userId:string, input:{
        type: FieldType,
        label: string,
        required?:boolean,
        order: number,
        options?:string[],
        placeholder?:string,
    })
    {
     const form = await db.select().from(formsTable)
            .where((
                eq(formsTable.id, formId),
                eq(formsTable.userId, userId)
            ));

        if (form.length === 0) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Form not found"
            });
        }   
        const field = await db.insert(fieldsTable).values({
        formId, 
        type: input.type,
        label: input.label,
        required:input.required??false,
        order: input.order,
        options: input.options,
        placeholder:input.placeholder
    }).returning();

   return field[0]
}, 

    async updateField(fieldId:string, input:{
   label?:string,
   required?:boolean,
   options?:string[],
   placeholder?:string,
    }){
         const field = await db.update(fieldsTable).set(input).where(eq(fieldsTable.id, fieldId)).returning();

         if(field.length === 0 ){
        throw new TRPCError({
            code: "NOT_FOUND", 
            message: "Field not found"
        })
    }
    return field[0];
}, 

    async deleteField(fieldId:string){
        const field = await db.delete(fieldsTable)
     .where(eq(fieldsTable.id, fieldId)).
     returning();

        if(field.length === 0 ){
        throw new TRPCError({
            code: "NOT_FOUND", 
            message: "FIeld not found"
        })
    }
    return field[0];
}
}