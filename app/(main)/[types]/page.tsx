import Card from "@/components/general-component/Card";
import { getFilesByCategory } from "@/lib/appwrite/actions/file.action";
import { Models } from "node-appwrite";
import React from "react";

const Page = async ({ params }: { params: { type: string } }) => {
  const type = params?.type || "";

  const files = await getFilesByCategory();
  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>

        <div className="total-size-section">
          <p className="body-1">
            Total: <span className="h5">0 MB</span>
          </p>

          <div className="sort-container">
            <p className="body-1 hidden text-light-200 sm:block">Sort by:</p>
          </div>
        </div>
      </section>
      {files.total > 0 ? (
        <section className="file-list">
          {files.documents.map((file: Models.Document) => (
            <Card key={file.$id} file={file} />
          ))}
        </section>
      ) : (
        <p className="empty-result">No files has been uploaded!</p>
      )}
    </div>
  );
};

export default Page;
