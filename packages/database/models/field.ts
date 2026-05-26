import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  integer,
  text,
  jsonb,
} from "drizzle-orm/pg-core";
import {formsTable} from "./form";


export const fieldsTypeEnum = [
    "short_text",
    "long_text",
    "email",
    "number",
    "single_select",
    "multi_select",
] as const

export type FieldType = typeof fieldsTypeEnum[number];

export const fieldsTable = pgTable("fields", {
  id: uuid("id").primaryKey().defaultRandom(),

  formId: uuid("form_id").notNull().references(() => formsTable.id, {onDelete:"cascade"}),

  type: varchar("type", {length:50}).notNull(),

  label: varchar("label", {length:255}).notNull(),

  required: boolean("required").default(false),

  order: integer("order").notNull().default(0),

  options:jsonb("options").$type<string[]>().default([]),

  placeholder:text("placeholder"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export type SelectField = typeof fieldsTable.$inferSelect;
export type InsertField = typeof fieldsTable.$inferInsert;