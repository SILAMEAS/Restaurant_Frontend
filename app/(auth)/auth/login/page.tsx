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

        // Update redirection logic based on role
        switch (res.role) {
          case Role.ADMIN:
            router.replace('/admin');
            break;
          case Role.OWNER:
            router.replace('/owner');
            break;
          case Role.USER:
            router.replace('/');
            break;
          default:
            router.replace('/');
        }

      }
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center p-4 sm:p-8">
      <Link 
        href="/" 
        className="absolute left-4 top-4 md:left-8 md:top-8 text-xl font-bold text-white hover:text-primary transition-colors duration-200 flex items-center gap-2"
      >
        <span className="text-primary">La</span>Cy
      </Link>
      
      <Card className="w-full max-w-md bg-black/30 backdrop-blur-xl border border-gray-800 shadow-2xl transition-all duration-300 hover:shadow-primary/10">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Login</CardTitle>
          <CardDescription className="text-gray-400">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-200">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email")}
                className="bg-gray-900/50 border-gray-800 focus:border-primary transition-all duration-200 placeholder:text-gray-500"
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-gray-200">Password</Label>
                <Link 
                  href="/auth/forgot-password" 
                  className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className="bg-gray-900/50 border-gray-800 focus:border-primary transition-all duration-200 pr-10 placeholder:text-gray-500"
                  aria-invalid={errors.password ? "true" : "false"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-primary transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              className="w-full bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 transition-opacity duration-200 text-white font-medium py-2.5" 
              type="submit" 
              disabled={loginResult.isLoading}
            >
              {loginResult.isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                "Login"
              )}
            </Button>
            <div className="text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <Link 
                href="/auth/register" 
                className="text-primary hover:text-primary/80 transition-colors duration-200 font-medium"
              >
                Register
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}