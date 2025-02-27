export const appwriteConfig = {
  endPointUrl: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
  secretKey: process.env.NEXT_PUBLIC_APPWRITE_SECRET_KEY!,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
  userCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID!,
  fileCollectionId: process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID!,
  storageBucketId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID!,
};
