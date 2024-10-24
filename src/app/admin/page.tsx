/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
"use client";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader, MoveLeft } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";

export default function Signin() {
  const router = useRouter();
  const { status } = useSession();
  const [page, setPage] = useState("auth-page");
  const [loading, setLoading] = useState(false);
  const [usernameRegister, setUsernameRegister] = useState("");
  const [emailRegister, setEmailRegister] = useState("");
  const [passwordRegister, setPasswordRegister] = useState("");
  const [errorRegister, setErrorRegister] = useState<string | null>(null);
  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [errorLogin, setErrorLogin] = useState("");
  const [acceptUpdates, setAcceptUpdates] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(true);

  console.log("terms", acceptTerms, acceptUpdates);

  const onSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({
          usernameRegister,
          emailRegister,
          passwordRegister,
          userOptedForUpdates: acceptUpdates,
          userAgreedForTerms: acceptTerms,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        await signIn("credentials", {
          email: emailRegister,
          password: passwordRegister,
          redirect: true,
          callbackUrl: "/priority",
        });
        // signIn()
      } else {
        const error = (await res.json()).error;
        setErrorRegister(error);
        // console.log(await res.json());
      }
    } catch (error: any) {
      setErrorRegister(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: emailLogin,
        password: passwordLogin,
        redirect: true,
        callbackUrl: "/priority",
      });
      if (!res?.error) {
        // router.push(callbackUrl)
      } else {
        setErrorLogin("Invalid email or password");
      }
    } catch (err: any) {
    } finally {
      setLoading(false);
    }
  };

  // needed?
  useEffect(() => {
    if (status === "unauthenticated") {
      console.log("No JWT");
    } else if (status === "authenticated") {
      void router.push("/");
    }
  }, [status]);

  const renderPage = () => {
    switch (page) {
      case "auth-page":
        return (
          <div className="flex h-screen w-full flex-col items-center justify-center gap-8 bg-white pb-20 text-center text-black">
            <div className="rounded-lg bg-gray-100 p-8 shadow-lg">
              <div className="mt-8 text-4xl font-bold text-gray-800">
                Welcome to Rail Madad!
              </div>
              <div className="mt-4 text-lg text-gray-600">
                Helping you resolve rail-related issues.
              </div>
              <div className="mt-8">
                <Button
                  className="w-full rounded-md bg-blue-500 py-3 text-base font-medium text-white hover:bg-blue-600"
                  onClick={() => setPage("register")}
                >
                  Create an Admin Account
                </Button>
                <Button
                  variant={"link"}
                  className="mt-4 w-full py-2 text-sm text-blue-500 underline"
                  onClick={() => setPage("signin")}
                >
                  Already have an account? Sign In
                </Button>
              </div>
            </div>
          </div>
        );

      case "signin":
        return (
          <div className="flex h-screen w-full items-center justify-center bg-white text-black">
            <div className="w-full max-w-md rounded-lg bg-gray-100 p-8 shadow-lg">
              <div className="flex justify-start">
                <button
                  onClick={() => setPage("auth-page")}
                  className="text-gray-500 hover:text-black"
                >
                  <MoveLeft />
                </button>
              </div>
              <h1 className="text-4xl font-bold text-gray-800">Sign In</h1>
              <p className="mt-2 text-lg text-gray-600">
                Welcome back, you've been missed.
              </p>
              <form onSubmit={onSubmitLogin} className="mt-8">
                <label className="block pb-1 text-sm text-gray-700">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  value={emailLogin}
                  onChange={(e) => setEmailLogin(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-4 text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                />
                <label className="mt-4 block pb-1 text-sm text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordLogin}
                  onChange={(e) => setPasswordLogin(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-4 text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                />
                {errorLogin && (
                  <div className="mt-4 text-sm text-red-500">{errorLogin}</div>
                )}
                <Button
                  className="mt-8 w-full rounded-md bg-blue-500 py-3 text-lg font-medium text-white hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? <Loader className="animate-spin" /> : "Login"}
                </Button>
              </form>
            </div>
          </div>
        );

      case "register":
        return (
          <div className="flex h-screen w-full items-center justify-center bg-white text-black">
            <div className="w-full max-w-md rounded-lg bg-gray-100 p-8 shadow-lg">
              <div className="flex justify-start">
                <button
                  onClick={() => setPage("auth-page")}
                  className="text-gray-500 hover:text-black"
                >
                  <MoveLeft />
                </button>
              </div>
              <h1 className="text-4xl font-bold text-gray-800">Register</h1>
              <p className="mt-2 text-lg text-gray-600">
                Create your admin account today.
              </p>
              <form onSubmit={onSubmitRegister} className="mt-8">
                <label className="block pb-1 text-sm text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={usernameRegister}
                  onChange={(e) => {
                    const value = e.target.value.toLowerCase();
                    const filteredValue = value.replace(/[^a-z0-9.-]/g, "");
                    setUsernameRegister(filteredValue);
                  }}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-4 text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                />
                <label className="mt-4 block pb-1 text-sm text-gray-700">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  value={emailRegister}
                  onChange={(e) =>
                    setEmailRegister(e.target.value.toLowerCase())
                  }
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-4 text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                />
                <label className="mt-4 block pb-1 text-sm text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordRegister}
                  onChange={(e) => setPasswordRegister(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-4 text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                />
                {errorRegister && (
                  <div className="mt-4 text-sm text-red-500">
                    {errorRegister}
                  </div>
                )}
                <Button
                  className="mt-8 w-full rounded-md bg-blue-500 py-3 text-lg font-medium text-white hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? <Loader className="animate-spin" /> : "Register"}
                </Button>
              </form>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return <>{renderPage()}</>;
}
