"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from ".";
import { cookies } from "next/headers";
import { parseStringify } from "../utils";
import { appwriteConfig } from "./config";
import { appConfig } from "../config";

// authentication
const { databaseId, userCollectionId } = appwriteConfig;

export const getLoggedinUser = async () => {
  try {
    const sessionClient = await createSessionClient();
    const { databases, account } = sessionClient;

    if (!account || !databases) {
      return null;
    }

    const result = await (await account()).get();

    const user = await (
      await databases()
    ).listDocuments(databaseId as string, userCollectionId as string, [
      Query.equal("accountId", result.$id),
    ]);

    if (user.total <= 0) return null;

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const { databases } = await createAdminClient();
    const result = await getLoggedinUser();

    if (!result?.email) {
      return null; // Handle cases where user isn't logged in
    }

    const user = await (
      await databases()
    ).listDocuments(databaseId as string, userCollectionId as string, [
      Query.equal("email", result.email),
    ]);

    return user.documents[0] || null; // Return first user document or null
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};

export const getUserByEmail = async ({ email }: { email: string }) => {
  const { databases } = await createAdminClient();

  const result = await (
    await databases()
  ).listDocuments(databaseId as string, userCollectionId as string, [
    Query.equal("email", [email]),
  ]);

  return result.total > 0 ? result.documents[0] : null;
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  try {
    const session = await (
      await account()
    ).createEmailToken(ID.unique(), email);

    return session.userId;
  } catch (error) {
    console.log(error, "Failed to send email OTP");
    throw new Error("Failed to send email OTP");
  }
};

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();

    const session = await (await account()).createSession(accountId, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      secure: appConfig.environment === "production", // Set this to false during development since the app runs on HTTP. If this is set to true, headers won't be set correctly over an insecure connection. I use `appConfig.environment === "production"` so I don’t have to update this manually. Instead, I just update `NEXT_PUBLIC_NODE_ENV` in the `.env` file when needed.
      sameSite: "strict",
      expires: new Date(session.expire),
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to verify OTP");
  }
};

export const createAccount = async ({
  fullName,
  email,
}: {
  email: string;
  fullName?: string;
}): Promise<string> => {
  try {
    // Check if the user already exists
    const existingUser = await getUserByEmail({ email });
    if (existingUser) throw new Error("User already exists!");

    // Send OTP and get account ID
    const accountId = await sendEmailOTP({ email });
    if (!accountId) throw new Error("Failed to send an OTP!");

    // Create a new user document in the database
    const { databases } = await createAdminClient();
    const db = await databases();

    await db.createDocument(
      databaseId as string,
      userCollectionId as string,
      ID.unique(),
      {
        fullName: fullName || "Unknown User",
        email,
        avatar: "https://cdn-icons-png.flaticon.com/512/9203/9203764.png",
        accountId,
      }
    );

    return JSON.parse(JSON.stringify(accountId));
  } catch (error) {
    console.error("Error in createAccount:", error);
    throw new Error("An unexpected error occurred while creating the account.");
  }
};

export const signInUser = async (email: string) => {
  try {
    const existingUser = await getUserByEmail({ email });

    if (existingUser) {
      await sendEmailOTP({ email });
      return parseStringify(existingUser.accountId);
    }

    return parseStringify({ accountId: null });
  } catch {}
};
