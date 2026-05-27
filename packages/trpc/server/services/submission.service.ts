import db, { eq, inArray } from "@repo/database";
import { TRPCError } from "@trpc/server";
import {formsTable,fieldsTable,submissionsTable,responsesTable,usersTable,} from "@repo/database/schema";
import { Resend } from "resend";
import type { InferSelectModel } from "drizzle-orm";

type FieldRow = InferSelectModel<typeof fieldsTable>;
type SubmissionRow = InferSelectModel<typeof submissionsTable>;
type ResponseRow = InferSelectModel<typeof responsesTable>;
type FormRow = InferSelectModel<typeof formsTable>;

const resend = new Resend(process.env.RESEND_API_KEY);

export const submissionService = {
    async getPublicForm(formId: string) {
        const formResult = await db
            .select()
            .from(formsTable)
            .where(eq(formsTable.id, formId));

        const form = formResult[0];

        if (!form) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Form not found",
            });
        }

        const fields = await db
            .select()
            .from(fieldsTable)
            .where(eq(fieldsTable.formId, formId))
            .orderBy(fieldsTable.order);

        return { ...form, fields };
    },

    async submitForm(input: {
        formId: string;
        submitterEmail: string;
        submittedBy?: string;
        answers: { fieldId: string; value: string }[];
    }) {
        const formResult = await db
            .select()
            .from(formsTable)
            .where(eq(formsTable.id, input.formId));

        const form = formResult[0];

        if (!form) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Form not found",
            });
        }

        if (!form.isPublished) {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "This form is not published yet",
            });
        }

        if (!form.isPublic && !input.submittedBy) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Login first to submit this form",
            });
        }

        const submissionResult = await db
            .insert(submissionsTable)
            .values({
                formId: input.formId,
                submittedBy: input.submittedBy ?? null,
                submitterEmail: input.submitterEmail,
            })
            .returning();

        const submission = submissionResult[0];

        if (!submission) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to create submission",
            });
        }

        if (input.answers.length > 0) {
            await db.insert(responsesTable).values(
                input.answers.map((a) => ({
                    submissionId: submission.id,
                    fieldId: a.fieldId,
                    value: a.value,
                }))
            );
        }

        const fields = await db
            .select()
            .from(fieldsTable)
            .where(eq(fieldsTable.formId, input.formId))
            .orderBy(fieldsTable.order);

        const answersSummary = input.answers
            .map((a) => {
                const field = fields.find(
                    (f: FieldRow) => f.id === a.fieldId
                );

                return `
                    <tr>
                        <td style="padding:8px;border-bottom:1px solid #f0ede8;color:#555">
                            ${field?.label ?? "Unknown"}
                        </td>
                        <td style="padding:8px;border-bottom:1px solid #f0ede8;color:#000">
                            ${a.value}
                        </td>
                    </tr>
                `;
            })
            .join("");

        const emailTable = `
            <table style="width:100%;border-collapse:collapse;font-family:sans-serif;font-size:14px">
                <thead>
                    <tr>
                        <th style="padding:8px;text-align:left;border-bottom:2px solid #000;color:#000">
                            Question
                        </th>
                        <th style="padding:8px;text-align:left;border-bottom:2px solid #000;color:#000">
                            Answer
                        </th>
                    </tr>
                </thead>
                <tbody>${answersSummary}</tbody>
            </table>
        `;

        if (input.submitterEmail) {
            await resend.emails.send({
                from: "onboarding@resend.dev",
                to: input.submitterEmail,
                subject: `Your response to '${form.title}'`,
                html: `
                    <p style="font-family:sans-serif">
                        Thanks for responding!
                    </p>

                    <p>
                        Here is a copy of your responses to
                        <strong>${form.title}</strong>:
                    </p>

                    ${emailTable}
                `,
            });
        }

        const creatorResult = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, form.userId));

        const creator = creatorResult[0];

        if (creator?.email) {
            await resend.emails.send({
                from: "onboarding@resend.dev",
                to: creator.email,
                subject: `New response to "${form.title}"`,
                html: `
                    <h2 style="font-family:sans-serif">
                        New form response!
                    </h2>

                    ${emailTable}
                `,
            });
        }

        return {
            success: true,
            submissionId: submission.id,
        };
    },

    async getSubmissions(formId: string, userId: string) {
        const formResult = await db
            .select()
            .from(formsTable)
            .where(eq(formsTable.id, formId));

        const form = formResult[0];

        if (!form || form.userId !== userId) {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "You are not the owner",
            });
        }

        return db
            .select()
            .from(submissionsTable)
            .where(eq(submissionsTable.formId, formId));
    },

    async getFormAnalytics(formId: string, userId: string) {
        const formResult = await db
            .select()
            .from(formsTable)
            .where(eq(formsTable.id, formId));

        const form = formResult[0];

        if (!form || form.userId !== userId) {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "You are not the owner",
            });
        }

        const fields = await db
            .select()
            .from(fieldsTable)
            .where(eq(fieldsTable.formId, formId))
            .orderBy(fieldsTable.order);

        const submissions = await db
            .select()
            .from(submissionsTable)
            .where(eq(submissionsTable.formId, formId));

        const submissionIds = submissions.map(
            (s: SubmissionRow) => s.id
        );

        const responses =
            submissionIds.length > 0
                ? await db
                      .select()
                      .from(responsesTable)
                      .where(
                          inArray(
                              responsesTable.submissionId,
                              submissionIds
                          )
                      )
                : [];

        const responsesPerDay: Record<string, number> = {};

        submissions.forEach((s: SubmissionRow) => {
            if (s.createdAt) {
                const day = s.createdAt
                    .toISOString()
                    .split("T")[0] ?? "";

                if (day) {
                    responsesPerDay[day] =
                        (responsesPerDay[day] ?? 0) + 1;
                }
            }
        });

        const perField = fields.map((field: FieldRow) => {
            const fieldResponses = responses.filter(
                (r: ResponseRow) => r.fieldId === field.id
            );

            const answers = fieldResponses.map(
                (r: ResponseRow) => r.value
            );

            const optionCounts: Record<string, number> = {};

            if (
                field.type === "single_select" ||
                field.type === "multi_select"
            ) {
                const options = (field.options as string[]) ?? [];

                options.forEach((o) => {
                    optionCounts[o] = 0;
                });

                answers.forEach((a: string) => {
                    const selected = a
                        .split(",")
                        .map((v: string) => v.trim());

                    selected.forEach((v: string) => {
                        optionCounts[v] =
                            (optionCounts[v] ?? 0) + 1;
                    });
                });
            }

            return {
                fieldId: field.id,
                label: field.label,
                type: field.type,
                answers,
                optionCounts,
            };
        });

        return {
            form,
            totalResponses: submissions.length,
            responsesPerDay,
            perField,
        };
    },

    async getAllFormsAnalytics(userId: string) {
        const forms = await db
            .select()
            .from(formsTable)
            .where(eq(formsTable.userId, userId));

        const result = await Promise.all(
            forms.map(async (form: FormRow) => {
                const submissions = await db
                    .select()
                    .from(submissionsTable)
                    .where(eq(submissionsTable.formId, form.id));

                return {
                    id: form.id,
                    title: form.title,
                    isPublished: form.isPublished,
                    isPublic: form.isPublic,
                    totalResponses: submissions.length,
                    createdAt: form.createdAt,
                };
            })
        );

        return result;
    },
};