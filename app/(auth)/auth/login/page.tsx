"use client";

import type React from "react";
import {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {Eye, EyeOff} from "lucide-react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {LoginFormData, loginSchema} from "@/lib/redux/type";

import {Slide, toast} from "react-toastify";
import {useLoginMutation} from "@/lib/redux/auth";
import {Role, setLogin} from "@/lib/redux/counterSlice";
import {store} from "@/lib/redux/store";
import Cookies from 'js-cookie'
import {handleApiCall} from "@/lib/handleApiCall";
import {COOKIES} from "@/constant/COOKIES";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [login,loginResult]=useLoginMutation();

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  // Handle form submission
  const onSubmit = async (data: LoginFormData) => {
    await handleApiCall({
      apiFn: () => login(data).unwrap(),
      onSuccess: (res) => {
        toast.success("Login success!", {
          theme: "dark",
          transition: Slide,
        });

        store.dispatch(setLogin(res));
        Cookies.set(COOKIES.TOKEN, res.accessToken, { secure: true });
        Cookies.set(COOKIES.ROLE, res.role, { secure: true });


        res?.role===Role.ADMIN?router.push('/admin'):router.push("/")


      }
    });
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 text-lg font-bold">
        LaCy
      </Link>
      <Card className="w-full max-w-md bg-transparent border-2">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Enter your email and password to login to your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} >
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email")}
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/auth/forgot-password" className="text-sm text-primary underline-offset-4 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  aria-invalid={errors.password ? "true" : "false"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button className="w-full" type="submit" disabled={loginResult.isLoading}>
              {loginResult.isLoading ? "Logging in..." : "Login"}
            </Button>
            <div className="mt-4 text-center text-sm text-white">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-link underline-offset-4 hover:underline">
                Register
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}