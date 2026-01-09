"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@/lib/resolver";
import { signupSchema, SignupInput } from "@/lib/validators";
import { useAuth } from "@/components/auth/AuthProvider";
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const {
    signUpWithEmail,
    signInWithGoogle,
    signInWithMicrosoft,
    signInWithYahoo,
    loading: authLoading,
  } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: SignupInput) {
    setIsLoading(true);
    try {
      await signUpWithEmail(data.name, data.email, data.password);
      toast.success("Account Created", { description: "Welcome!" });
      router.push("/dashboard");
    } catch (e: any) {
      toast.error("Signup Failed", {
        description: e?.message || "Could not create account.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleOAuth(provider: "google" | "microsoft" | "yahoo") {
    setIsLoading(true);
    try {
      if (provider === "google") await signInWithGoogle();
      if (provider === "microsoft") await signInWithMicrosoft();
      if (provider === "yahoo") await signInWithYahoo();
      toast.success("Signup Successful");
      router.push("/dashboard");
    } catch (e: any) {
      toast.error("Signup Failed", {
        description: e?.message || "OAuth error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => handleOAuth("google")}
            disabled={isLoading || authLoading}
          >
            Sign up with Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => handleOAuth("microsoft")}
            disabled={isLoading || authLoading}
          >
            Sign up with Microsoft
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => handleOAuth("yahoo")}
            disabled={isLoading || authLoading}
          >
            Sign up with Yahoo
          </Button>
        </div>
        <div className="my-4 text-center text-muted-foreground text-xs">
          or sign up with email
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
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
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign up"}
            </Button>
            <div className="text-center text-sm">
              <span className="text-gray-500">Already have an account? </span>
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
