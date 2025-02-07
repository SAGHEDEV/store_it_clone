import { createAdminClient } from "..";
import { InputFile } from "node-appwrite/file";
import { appwriteConfig } from "../config";
import { ID } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

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
      extensin: getFileType(bufferFile.name).extension,
      size: bufferFile.sizeOriginal,
      owner: ownerId,
      accountId,
      users: [],
      buckeetFileId: bufferFile.$id,
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
