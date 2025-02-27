"use server";

import { createAdminClient } from "..";
import { InputFile } from "node-appwrite/file";
import { appwriteConfig } from "../config";
import { ID, Query } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user.actions";

export const uploadFiles = async ({
  file,
  accountId,
  ownerId,
  path,
}: {
  file: File;
  accountId: string;
  ownerId: string;
  path: string;
}) => {
  const { storage, databases } = await createAdminClient();
  try {
    const inputFile = InputFile.fromBuffer(file, file.name);

    const bufferFile = await (
      await storage()
    ).createFile(appwriteConfig.storageBucketId, ID.unique(), inputFile);

    const fileDocument = {
      type: getFileType(bufferFile.name).type,
      name: bufferFile.name,
      url: constructFileUrl(bufferFile.$id),
      extension: getFileType(bufferFile.name).extension,
      size: bufferFile.sizeOriginal,
      owner: ownerId,
      accountId,
      users: [],
      bucketFileId: bufferFile.$id,
    };

    const fileResult = await (await databases())
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.fileCollectionId,
        ID.unique(),
        fileDocument
      )
      .catch(async (error) => {
        console.log(error);
        await (
          await storage()
        ).deleteFile(appwriteConfig.storageBucketId, bufferFile.$id);

        revalidatePath(path);
      });

    return parseStringify(fileResult);
  } catch {}
};

const createQuery = (currentUser: any) => {
  const queries = [
    Query.or([
      Query.equal("owner", [currentUser.$id]),
      Query.contains("users", [currentUser.email]),
    ]),
  ];

  return queries;
};

export const getFilesByCategory = async () => {
  const { databases } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("No user was found!");
    }
    const queries = createQuery(currentUser);
    const result = await (
      await databases()
    ).listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.fileCollectionId,
      queries
    );

    console.log(result);

    return parseStringify(result);
  } catch (error) {
    console.log(error);
    throw new Error("Error occurred while fetching documents!");
  }
};
