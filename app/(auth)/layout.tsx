import { getLoggedinUser } from "@/lib/appwrite/actions";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getLoggedinUser();

  if (user) return redirect("/");
  return (
    <main className="w-full min-h-screen flex bg-white">
      <div className="hidden lg:flex flex-col justify-between h-screen bg-brand p-16 min-w-[580px]">
        <div>
          <Image
            src="/assets/images/full-logo.svg"
            alt="Store It"
            width={223}
            height={61}
          />
        </div>
        <div className="max-w-[430px] flex flex-col gap-4 text-white">
          <h1 className="h1">Manage your files the best way</h1>
          <p className="body-1">
            Awesome, we&apos;ve created the perfect place for you to store all
            your documents.
          </p>
        </div>
        <div>
          <Image
            src="/assets/images/auth-image.svg"
            alt="Store It"
            width={342}
            height={342}
          />
        </div>
      </div>
      <div className="w-full flex flex-col gap-10 justify-center items-center">
        {children}
      </div>
    </main>
  );
};

export default Layout;
