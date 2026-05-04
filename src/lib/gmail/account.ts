import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { encrypt, decrypt } from "@/lib/oauth/encryption";

export type StoredAccount = {
  id: string;
  email: string;
  refreshToken: string;
  accessToken: string | null;
  expiresAt: Date | null;
};

export async function getStoredAccount(): Promise<StoredAccount | null> {
  const rows = await db.select().from(schema.gmailAccounts).limit(1);
  const row = rows[0];
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    refreshToken: decrypt(row.refreshTokenEncrypted),
    accessToken: row.accessTokenEncrypted
      ? decrypt(row.accessTokenEncrypted)
      : null,
    expiresAt: row.expiresAt,
  };
}

export async function saveAccount(input: {
  email: string;
  refreshToken: string;
  accessToken: string;
  expiresAt: Date;
}): Promise<void> {
  const refreshTokenEncrypted = encrypt(input.refreshToken);
  const accessTokenEncrypted = encrypt(input.accessToken);

  await db
    .insert(schema.gmailAccounts)
    .values({
      email: input.email,
      refreshTokenEncrypted,
      accessTokenEncrypted,
      expiresAt: input.expiresAt,
    })
    .onConflictDoUpdate({
      target: schema.gmailAccounts.email,
      set: {
        refreshTokenEncrypted,
        accessTokenEncrypted,
        expiresAt: input.expiresAt,
        updatedAt: new Date(),
      },
    });
}

export async function updateAccessToken(
  email: string,
  accessToken: string,
  expiresAt: Date,
): Promise<void> {
  await db
    .update(schema.gmailAccounts)
    .set({
      accessTokenEncrypted: encrypt(accessToken),
      expiresAt,
      updatedAt: new Date(),
    })
    .where(eq(schema.gmailAccounts.email, email));
}

export async function clearAccount(email: string): Promise<void> {
  await db
    .delete(schema.gmailAccounts)
    .where(eq(schema.gmailAccounts.email, email));
}
