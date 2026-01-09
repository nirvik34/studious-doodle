"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@/lib/resolver";
import { loginSchema, LoginInput } from "@/lib/validators";
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

export default function LoginPage() {
  const router = useRouter();
  const {
    signInWithGoogle,
    signInWithMicrosoft,
    signInWithYahoo,
    signInWithEmail,
    loading: authLoading,
  } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginInput) {
    setIsLoading(true);
    try {
      await signInWithEmail(data.email, data.password);
      toast.success("Login Successful", { description: "Welcome back!" });
      router.push("/dashboard");
    } catch (e: any) {
      toast.error("Login Failed", {
        description: e?.message || "Invalid email or password",
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
      toast.success("Login Successful");
      router.push("/dashboard");
    } catch (e: any) {
      toast.error("Login Failed", { description: e?.message || "OAuth error" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
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
            Sign in with Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => handleOAuth("microsoft")}
            disabled={isLoading || authLoading}
          >
            Sign in with Microsoft
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => handleOAuth("yahoo")}
            disabled={isLoading || authLoading}
          >
            Sign in with Yahoo
          </Button>
        </div>
        <div className="my-4 text-center text-muted-foreground text-xs">
          or sign in with email
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-6"
          >
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
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
            <div className="text-center text-sm">
              <span className="text-gray-500">
                Don&apos;t have an account?{" "}
              </span>
              <Link
                href="/signup"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
