"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { createAccount, signInUser } from "@/lib/appwrite/actions";
import OTPModal from "./OTPModal";

const AuthForm = ({ type }: { type: "sign-in" | "sign-up" }) => {
  const [loading, setLoading] = useState(false);
  const [accountId, setAccountId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const authFormSchema = z.object({
    fullName:
      type == "sign-up"
        ? z
            .string()
            .min(3, {
              message: "Fullname must be at least 2 characters!",
            })
            .max(80)
            .trim()
        : z.string().optional(),
    email: z.string().email({ message: "Enter a valid Email address!" }),
    // password: z
    //   .string()
    //   .min(6, {
    //     message: "Password must not be less than 6 characters!",
    //   })
    //   .max(16, {
    //     message: "Password must not be longer than 8 characters!",
    //   })
    //   .regex(/[a-zA-Z]/, { message: "Password must contain a letter!" })
    //   .regex(/[0-9]/, { message: "Password must contain a number!" })
    //   .regex(/[^a-zA-Z0-9]/, {
    //     message: "Password must contain a special character!",
    //   })
    //   .trim(),
  });

  const form = useForm<z.infer<typeof authFormSchema>>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof authFormSchema>) => {
    const { email, fullName } = values;
    setLoading(true);
    setErrorMessage("");
    try {
      if (type === "sign-up") {
        const userId = await createAccount({ email, fullName });
        setAccountId(userId as string);
      } else {
        const userId = await signInUser(email);
        console.log(userId);
        setAccountId(userId as string);
      }
    } catch (error) {
      setErrorMessage(
        error.message ||
          "Kindly try again or check if this email has been used!"
      );
      // setErrorMessage(error.message);
      setAccountId("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-8 px-6 w-full lg:max-w-[580px]"
        >
          <h1 className="h1">
            {type === "sign-in" ? "Login" : "Create Account"}
          </h1>

          {type === "sign-up" ? (
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="shad-form-item">
                  <FormLabel className="shad-form-label">Fullname:</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g John Doe"
                      {...field}
                      className="shad-input subtitle-2 placeholder:text-light-200"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            "   "
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className=" shad-form-item">
                <FormLabel className="shad-form-label">
                  Email address:
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g johndoe@gmail.com"
                    {...field}
                    className="shad-input subtitle-2 placeholder:text-light-200"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <Button
            className="w-full primary-btn shad-submit-btn h-[60px] button"
            type="submit"
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
          <p className="w-full text-center body-2">
            {type == "sign-up" ? "Already" : "Don't"} have an account?{" "}
            <Link
              href={type == "sign-up" ? "/sign-in" : "/sign-up"}
              className="text-link"
            >
              {type == "sign-up" ? "Login" : "Create account"}
            </Link>
          </p>
        </form>
      </Form>

      {/* OTP Modal  */}
      {accountId && (
        <OTPModal accountId={accountId} email={form.getValues("email")} />
      )}
      {/* <OTPModal /> */}
    </>
  );
};

export default AuthForm;
