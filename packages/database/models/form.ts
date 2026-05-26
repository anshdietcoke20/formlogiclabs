import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  text,
} from "drizzle-orm/pg-core";
import {usersTable} from "./user"

export const formsTable = pgTable("forms", {
  id: uuid("id").primaryKey().defaultRandom(),

  title: varchar("title", {length: 255}).notNull().default("Untitled Form"),

  userId: uuid("user_id").notNull().references(() => usersTable.id, {onDelete:"cascade"}),

  isPublished:boolean("is_published").default(false),
  isPublic: boolean("is_public").default(true),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export type SelectForm = typeof formsTable.$inferSelect;
export type InsertForm = typeof formsTable.$inferInsert;