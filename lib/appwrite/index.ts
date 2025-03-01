"use server";

import { Account, Client, Databases, Storage } from "node-appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { cookies } from "next/headers";

export const createSessionClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endPointUrl)
    .setProject(appwriteConfig.projectId);

  const session = (await cookies()).get("appwrite-session");

  if (!session) {
    return {
      account: null,
      databases: null,
    };
  }

  client.setSession(session.value);
  return {
    account: async () => new Account(client),
    databases: async () => new Databases(client),
  };
};

export const createAdminClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endPointUrl)
    .setProject(appwriteConfig.projectId)
    .setKey(appwriteConfig.secretKey);

  return {
    account: async () => new Account(client),
    databases: async () => new Databases(client),
    storage: async () => new Storage(client),
  };
};
