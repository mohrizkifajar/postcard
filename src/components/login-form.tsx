"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type * as z from "zod";
import { login } from "@/actions/auth";
import { loginSchema } from "@/lib/definitions";

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginValues) => {
    setLoading(true);
    const error = await login(data);

    if (error) {
      setError(error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-900 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="mt-2 text-gray-600">
            Please enter your credentials to login
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="p-4 text-white bg-red-500 rounded-md">{error}</div>
          )}
          <div className="relative">
            <Mail className="absolute w-5 h-5 text-gray-400 top-3 left-3" />
            <input
              id="identity"
              type="text"
              placeholder="Identity"
              {...register("identity")}
              className="w-full px-10 py-3 text-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {errors.identity && (
            <p className="mt-2 text-red-500">{errors.identity.message}</p>
          )}
          <div className="relative">
            <KeyRound className="absolute w-5 h-5 text-gray-400 top-3 left-3" />
            <input
              id="otp_code"
              type="text"
              placeholder="OTP Code"
              {...register("otp_code")}
              className="w-full px-10 py-3 text-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              autoComplete="off"
            />
          </div>
          {errors.otp_code && (
            <p className="mt-2 text-red-500">{errors.otp_code.message}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {loading ? (
              <svg
                className="w-5 h-5 mx-auto text-white animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-labelledby="id"
              >
                <title>Loading</title>
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <div className="text-sm text-center text-gray-600">
          <p>
            Don't have an account?{" "}
            <a
              href="/sign-up"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign up
            </a>
          </p>
          <p className="mt-2">
            By signing in, you agree to our{" "}
            <a
              href="/terms"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy-policy"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
