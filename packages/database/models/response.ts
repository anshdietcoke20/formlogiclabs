import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  text,
} from "drizzle-orm/pg-core";
import {submissionsTable} from "./submission";
import {fieldsTable} from "./field";

export const responsesTable = pgTable("responses",{
    id: uuid("id").primaryKey().defaultRandom(),

    submissionId: uuid("submission_id").notNull().references(() => submissionsTable.id, { onDelete: "cascade" }),

    fieldId: uuid("field_id").notNull().references(() => fieldsTable.id, {onDelete: "cascade"}),

    value: text("value").notNull(),
})

export type SelectResponse = typeof responsesTable.$inferSelect;
export type InsertResponse = typeof responsesTable.$inferInsert;