import {z} from "../../schema";
import {submissionService} from "../../services/submission.service";
import {publicProcedure, protectedProcedure, router} from "../../trpc"; 

export const submissionRouter = router ({
    getPublicForm : publicProcedure.input(z.object({formId: z.string().uuid()}))
    .query(({input}) => submissionService.getPublicForm(input.formId)),

    submitForm : publicProcedure.input(z.object({
        formId: z.string().uuid(),
        submitterEmail: z.string().email(),
        submittedBy: z.string().uuid().optional(),
        answers: z.array(z.object({
            fieldId: z.string().uuid(),
            value : z.string(),
    })
),
    })
).mutation(({input}) => submissionService.submitForm(input)),

getSubmission : protectedProcedure.input(z.object({formId: z.string().uuid()}))
.query(({input,ctx}) => submissionService.getSubmissions(input.formId, ctx.user.id)), 

getFormAnalytics: protectedProcedure.input(z.object({formId: z.string().uuid()}))
.query(({input,ctx}) => submissionService.getFormAnalytics(input.formId, ctx.user.id)),

getAllFormsAnalytics: protectedProcedure.query(({ctx}) => submissionService.getAllFormsAnalytics(ctx.user.id))
})
