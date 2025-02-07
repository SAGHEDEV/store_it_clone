import Header from "@/components/general-component/Header";
import MobileNavigation from "@/components/general-component/MobileNavigation";
import SideBar from "@/components/general-component/SideBar";
import { Toaster } from "@/components/ui/toaster";
import { getCurrentUser } from "@/lib/appwrite/actions/user.actions";
import { redirect } from "next/navigation";
import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const loggedInUser = await getCurrentUser();

  if (!loggedInUser) return redirect("/sign-in");

  return (
    <main className="flex h-screen">
      <SideBar
        fullName={loggedInUser?.fullName}
        email={loggedInUser?.email}
        avatar={loggedInUser?.avatar}
      />
      <main className="h-full flex flex-1 flex-col">
        <MobileNavigation
          fullName={loggedInUser?.fullName}
          email={loggedInUser?.email}
          avatar={loggedInUser?.avatar}
          {...loggedInUser}
        />
        <Header {...loggedInUser} />
        <div className="main-content">{children}</div>
      </main>
      <Toaster />
    </main>
  );
};

export default Layout;
