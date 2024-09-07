"use client";

import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { signInSchema } from "@/lib/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Signin() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await axios.post("/api/auth/callback/credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    console.log(result.data);
    if (!result) {
      toast({
        title: "Login Failed",
        description: "Incorrect email and password",
        variant: "destructive",
      });
    }

    toast({
      title: "Success",
      description: result.data.message,
    });

    router.push("/");
    setIsSubmitting(false);
  };

  return (
    <div>
      <div className="flex flex-col h-screen justify-center">
        <div className="flex justify-center items-center ">
          <div className="p-8 border w-full max-w-md rounded-lg shadow-lg">
            <Header title="Login" />
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <Input placeholder="John Doe" {...field} />
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
                    "Sign in"
                  )}
                </Button>
              </form>
            </Form>
            <div className="text-center mt-2">
            <span>Don&apos;t have an account{<a href="/signup" className="underline">Sign up</a>}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
