import { z } from "../../schema";
import { formService } from "../../services/form.service";
import { protectedProcedure, router } from "../../trpc";
import { fieldsTypeEnum } from "@repo/database/schema";


export const formsRouter = router({
    getForms: protectedProcedure.query(({ctx}) => {
        return formService.getForms(ctx.user.id)
    }), 

    getFormById: protectedProcedure.input(z.object({formId : z.string().uuid()}))
    .query(({input,ctx}) => {
        return formService.getFormById(input.formId, ctx.user.id)
    }), 

    createForm: protectedProcedure.mutation(({ctx}) => {
        return formService.createForm(ctx.user.id)
    }), 

    updateForm: protectedProcedure.input(z.object({
        formId: z.string().uuid(),
        title: z.string(),
    })).mutation(({input, ctx}) => {
        return formService.updateForm(input.formId, ctx.user.id, {title: input.title})
    }),

    publishForm : protectedProcedure.input(z.object({formId : z.string().uuid()}))
    .mutation(({input,ctx}) => {
        return formService.publishForm(input.formId, ctx.user.id)
    }), 

    publicOrPrivate: protectedProcedure.input(z.object({formId : z.string().uuid(), isPublic:z.boolean()}))
    .mutation(({input,ctx}) => {
        return formService.publicOrPrivate(input.formId, ctx.user.id, input.isPublic)
    }), 

    deleteForm: protectedProcedure.input(z.object({formId: z.string().uuid()}))
    .mutation(({input,ctx}) => {
        return formService.deleteForm(input.formId, ctx.user.id)
    }), 

    addField: protectedProcedure.input(z.object({
        formId:z.string().uuid(),
        type: z.enum(fieldsTypeEnum),
        label: z.string().min(1),
        required: z.boolean().optional(),
        order: z.number(),
        options: z.array(z.string()).optional(),
        placeholder: z.string().optional(),
    })).mutation(({input,ctx}) => {
        return formService.addField(input.formId, ctx.user.id, input)
    }), 

    updateField:protectedProcedure.input(z.object({
        fieldId:z.string().uuid(),
        label: z.string().optional(),
        required: z.boolean().optional(),
        options: z.array(z.string()).optional(),
        placeholder: z.string().optional(),
    })).mutation(({input,ctx}) => {
        const { fieldId, ...rest} = input;
        return formService.updateField(fieldId,ctx.user!.id, rest)
}), 

    deleteField: protectedProcedure.input(z.object({ fieldId: z.string().uuid() }))
    .mutation(({ input }) => {
        return formService.deleteField(input.fieldId)
    }),

})


