import { pgTable, varchar, uuid, timestamp } from "drizzle-orm/pg-core";

export const UserTable = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  hashedPassword: varchar("hashedPassword", { length: 255 }).notNull(),
  salt: varchar("salt", { length: 255 }).notNull(),
});

export const SessionTable = pgTable("session", {
  id: varchar("id", { length: 1024 }).primaryKey().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => UserTable.id),
  expiresOn: timestamp("expires_on", { mode: "date" }).notNull(),
});
