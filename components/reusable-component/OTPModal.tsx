"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import {
  sendEmailOTP,
  verifySecret,
} from "@/lib/appwrite/actions/user.actions";
import { useRouter } from "next/navigation";

const OTPModal = ({
  accountId,
  email,
}: {
  accountId: string;
  email: string;
}) => {
  const [open, setOpen] = useState(true);
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const sessionId = await verifySecret({ accountId, password: passcode });
      console.log(sessionId);
      if (sessionId) router.push("/");
    } catch (error) {
      setErrorMessage(error?.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="bg-white flex flex-col gap-4 items-center p-8 rounded-[20px]">
        <span
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 cursor-pointer p-2 hover:bg-black/10 rounded-full"
        >
          <X />
        </span>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center h2">
            Enter OTP
          </AlertDialogTitle>
          <AlertDialogDescription className="body-2">
            We&apos;ve sent a code to{" "}
            <span className="font-medium italic text-brand">{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <InputOTP
          value={passcode}
          onChange={setPasscode}
          maxLength={6}
          className="shad-otp"
        >
          <InputOTPSlot className="shad-otp-slot" index={0} />
          <InputOTPSlot className="shad-otp-slot" index={1} />
          <InputOTPSlot className="shad-otp-slot" index={2} />
          <InputOTPSlot className="shad-otp-slot" index={3} />
          <InputOTPSlot className="shad-otp-slot" index={4} />
          <InputOTPSlot className="shad-otp-slot" index={5} />
        </InputOTP>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <AlertDialogFooter className="w-full">
          <Button
            className="w-full primary-btn shad-submit-btn h-[60px] button"
            type="submit"
            onClick={handleSubmit}
            disabled={passcode.length < 6}
          >
            Submit{" "}
            {loading ? (
              <Image
                src="/assets/icons/loader.svg"
                alt="..."
                width={24}
                height={24}
                className="animate-spin"
              />
            ) : (
              ""
            )}
          </Button>
        </AlertDialogFooter>
        <p className="body-2">
          Didn&apos;t get a code?{" "}
          <span className="text-link" onClick={() => sendEmailOTP({ email })}>
            CLick to resend
          </span>
        </p>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OTPModal;
