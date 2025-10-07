import { db } from "@/drizzle/db";
import { SessionTable, UserTable } from "@/drizzle/schema";
import { eq, and, gt } from "drizzle-orm";
import { hashPassword, generateSalt, comparePasswords } from "./passwordHasher";
import crypto from "crypto";

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  name: string;
  email: string;
  password: string;
}

interface User {
  id: string;
}

export const signUp = async (data: SignUpData) => {
  // TODO: check legnth of fields

  const existingUser = await db.select().from(UserTable).where(eq(UserTable.email, data.email));

  if (existingUser.length > 0) {
    return "Account already exists for this email";
  }

  try {
    const salt = generateSalt();
    const hashedPassword = (await hashPassword(data.password, salt)) as string;

    const [user] = await db
      .insert(UserTable)
      .values({
        name: data.name,
        email: data.email,
        hashedPassword: hashedPassword,
        salt: salt,
      })
      .returning({
        id: UserTable.id,
      });

    if (user === null) {
      return "Unable to create account";
    }

    const sessionId = await createUserSession(user);

    return sessionId;
  } catch {
    return "Unable to create account";
  }
};

export const login = async (data: LoginData) => {
  // TODO: check legnth of fields

  const existingUser = await db.select().from(UserTable).where(eq(UserTable.email, data.email));

  if (existingUser.length === 0) {
    return "No account exists for this email";
  }

  const user = existingUser[0];

  await db.delete(SessionTable).where(eq(SessionTable.userId, user.id));

  const isCorrectPassword = await comparePasswords(data.password, user.salt, user.hashedPassword);

  if (!isCorrectPassword) {
    return "Incorrect Password";
  }

  const sessionId = createUserSession(user);

  return sessionId;
};

export const logout = async (sessionId: string) => {
  await db.delete(SessionTable).where(eq(SessionTable.id, sessionId));
  return "Logged Out";
};

const createUserSession = async (user: User) => {
  const sessionId = crypto.randomBytes(512).toString("hex").normalize();
  const twoHoursFromNow = Date.now() + 2 * 60 * 60 * 1000;

  await db.insert(SessionTable).values({
    id: sessionId,
    userId: user.id,
    expiresOn: new Date(twoHoursFromNow),
  });

  return sessionId;
};

export const getUserIdFromSessionId = async (sessionId: string) => {
  const session = await db
    .select()
    .from(SessionTable)
    .where(and(eq(SessionTable.id, sessionId), gt(SessionTable.expiresOn, new Date())));
  return session[0].userId;
};
