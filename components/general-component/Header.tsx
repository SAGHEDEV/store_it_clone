import React from "react";
import FileUploader from "./FileUploader";
import { Button } from "../ui/button";
import Image from "next/image";

const Header = ({
  ownerId,
  accountId,
}: {
  ownerId: string;
  accountId: string;
}) => {
  return (
    <div className="p-5 py-7 hidden lg:flex justify-between items-center">
      Seach Bar
      <div className="flex justify-end items-center gap-8">
        <FileUploader ownerId={ownerId} accountId={accountId} />
        <Button type="button" className="sign-out-button m-0 active:scale-95">
          <Image
            src="/assets/icons/logout.svg"
            alt="Logout"
            width={28}
            height={28}
          />
        </Button>
      </div>
    </div>
  );
};

export default Header;
