"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { navItems } from "@/app/cnstants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "../ui/button";
import FileUploader from "./FileUploader";

const MobileNavigation = ({
  fullName,
  email,
  avatar,
}: {
  fullName: string;
  email: string;
  avatar: string;
}) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <div className="mobile-header">
      <Link href={"/"}>
        <Image
          src="/assets/images/full-logo-2.svg"
          alt="Logo"
          width={140}
          height={40}
        />
      </Link>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <span className="w-[45px] h-[45px] flex justify-center items-center rounded-full hover:bg-brand/20 cursor-pointer">
            <Menu size={24} />
          </span>
        </SheetTrigger>
        <SheetContent className="shad-sheet h-screen">
          <SheetHeader className="py-4">
            <SheetTitle>
              <div className="mobile-user-info ">
                <Image
                  src={avatar}
                  alt="Avatar"
                  width={50}
                  height={50}
                  className="sidebar-user-avatar"
                />
                <div className="">
                  <p className="text-left subtitle-2 capitalize">{fullName}</p>
                  <p className="text-left caption">{email}</p>
                </div>
              </div>
              <Separator className="my-5 bg-brand/20" />
              <nav className="mobile-nav">
                <ul className="mobile-nav-list">
                  {navItems.map(({ url, name, icon }) => (
                    <Link key={name} href={url} className="lg:w-full">
                      <li
                        className={cn(
                          "mobile-nav-item hover:bg-brand/10",
                          pathname === url && "shad-active"
                        )}
                      >
                        <Image
                          src={icon}
                          alt={name}
                          width={24}
                          height={24}
                          className={cn(
                            "nav-icon",
                            pathname === url && "nav-icon-active"
                          )}
                        />
                        <p>{name}</p>
                      </li>
                    </Link>
                  ))}
                </ul>
              </nav>
            </SheetTitle>
          </SheetHeader>
          <Separator className="my-5 bg-brand/20" />

          <div>
            <FileUploader />
            <Button type="button" className="mobile-sign-out-button">
              <Image
                src="/assets/icons/logout.svg"
                alt="Logout"
                width={28}
                height={28}
              />{" "}
              Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;
