"use client";

import { useState } from "react";
import { signUpSchema } from "@/lib/auth-validation";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";

export default function Signup() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/signup", data);
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating user", error);
      const axiosError = error as AxiosError;
      const errorMessage = (axiosError.response?.data as { message: string })
        ?.message;
      toast({
        title: "Signup failed",
        description: errorMessage || "Error creating user",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-gradient-to-br from-purple-500 to-indigo-600">
      <div className="flex flex-col h-screen justify-center">
        <div className="flex justify-center items-center">
          <div className="p-8 bg-white border w-full max-w-md rounded-lg shadow-lg">
            <Header title="Register" />
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <Input placeholder="John Doe" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <Input placeholder="john@example.com" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <Input placeholder="123456" type="password" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="w-full"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" /> Please Wait
                    </>
                  ) : (
                    "Sign up"
                  )}
                </Button>
              </form>
            </Form>
            <Button onClick={() => signIn("google")}>
              Sign in with Google
            </Button>
            <div className="text-center mt-2 font-semibold">
              <span>
                Already have an account?{" "}
                {
                  <a href="/signin" className="underline">
                    Sign in
                  </a>
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
