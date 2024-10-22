"use client";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";

const NavbarActions = () => {
  const { data: session } = useSession();
  return (
    <div className="flex gap-4 text-xl">
      {!session ? (
        <Link href={"/admin"}>
          <Button variant={"ghost"} className="h-10 text-white">
            Admin Login
          </Button>
        </Link>
      ) : (
        <Button
          variant={"ghost"}
          onClick={() => signOut()}
          className="h-10 text-white"
        >
          Logout
        </Button>
      )}
      <Link href={"/complaint/track"}>
        <Button variant={"secondary"} className="h-10 font-bold">
          Track your complaint
        </Button>
      </Link>
    </div>
  );
};

export default NavbarActions;
