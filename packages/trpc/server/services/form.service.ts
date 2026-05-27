import {Resend} from "resend";
import { asc } from "@repo/database";
import db from "@repo/database";
import { eq } from "@repo/database";
import {TRPCError} from "@trpc/server";
import { formsTable, fieldsTable,usersTable } from "@repo/database/schema";
import type { FieldType } from "@repo/database/schema";

const resend = new Resend(process.env.RESEND_API_KEY);

export const formService = {
    async createForm(userId: string){

        const user = await db.select().from(usersTable).where(eq(usersTable.id, userId));

        const form = await db.insert(formsTable).values({
            title: "Untitle Form", 
            description: "",
            userId,
        }).returning();


    if(user[0]?.email){
    await resend.emails.send({
  from: 'onboarding@resend.dev',
  to: user[0].email,
  subject: 'Your form has been created!',
  html:`
                <h2 style="font-family:sans-serif">Form created successfully!</h2>
                <p style="font-family:sans-serif;color:#555">
                    Hi ${user[0].fullName}, your new form <strong>${form[0].title}</strong> has been created.
                </p>
                <p style="font-family:sans-serif;color:#555">
                    You can now add fields, publish it and share it with others.
                </p>
               
        `,
});
    }

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
        .set(input)
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

async reorderFields(input: { fields: { id: string; order: number }[] }) {
    await Promise.all(
        input.fields.map(({ id, order }) =>
            db.update(fieldsTable).set({ order }).where(eq(fieldsTable.id, id))
        )
    )
},

    async updateField(fieldId:string, input:{
   label?:string,
   required?:boolean,
   options?:string[],
   placeholder?:string,
   type?:string,
    }){
         const field = await db.update(fieldsTable).set({
            ...(input.label !== undefined && { label: input.label }),
            ...(input.required !== undefined && { required: input.required }),
            ...(input.options !== undefined && { options: input.options }),
            ...(input.placeholder !== undefined && { placeholder: input.placeholder }),
            ...(input.type !== undefined && {type: input.type}),
        }).where(eq(fieldsTable.id, fieldId)).returning();

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