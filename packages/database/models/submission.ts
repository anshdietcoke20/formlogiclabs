import {
  pgTable,
  uuid,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";
import {formsTable} from "./form";
import { usersTable } from "./user";

export const submissionsTable = pgTable("submissions", {
    id: uuid("id").primaryKey().defaultRandom(),

    formId: uuid("form_id").notNull().references(() => formsTable.id, {onDelete:"cascade"}),

    submittedBy: uuid("submitted_by").references(() => usersTable.id, {onDelete: "cascade"}),

    submitterEmail: varchar("submitter_email", {length:255}),

    createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),

})

export type SelectSubmission = typeof submissionsTable.$inferSelect;
export type InsertSubmission = typeof submissionsTable.$inferInsert;
