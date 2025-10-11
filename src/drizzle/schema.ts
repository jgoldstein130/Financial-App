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
    .unique()
    .references(() => UserTable.id),
  expiresOn: timestamp("expires_on", { mode: "date" }).notNull(),
});

export const UserInfoTable = pgTable("userInfo", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => UserTable.id),
  plaidToken: varchar("plaid_token", { length: 255 }),
});
