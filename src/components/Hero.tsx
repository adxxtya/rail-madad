import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { getServerAuthSession } from "@/server/auth";

const Hero = async () => {
  const session = await getServerAuthSession();
  return (
    <div className="flex h-full w-full p-24 pt-6">
      <div className="flex h-full w-full flex-col justify-center gap-8 p-6">
        <div className="text-6xl font-bold text-black">
          RailMadadAI - For Inquiries, Assistance & Complaints
        </div>
        <div className="text-lg font-light text-black">
          RailMadadAI is your one-stop platform for submitting and managing
          complaints related to railway services. Upload photos and videos,
          provide details of your issue, and let our AI-powered system assist
          you in registering your grievance efficiently. Get quick responses and
          track your complaints seamlessly, ensuring a better and more
          responsive experience.
        </div>
        <div className="flex gap-4">
          <Link href={"/complaint/new"}>
            <Button size={"lg"}>Register a complaint</Button>
          </Link>
          <Link href={"/complaint/all"}>
            <Button variant={"ghost"} size={"lg"}>
              View old complaints
            </Button>
          </Link>
        </div>
      </div>
      <div className="h-full w-full p-4">
        <div className="h-full w-full rounded-3xl shadow-lg">
          <img
            src="/trainn.jpg"
            className="h-full w-full scale-x-[-1] rounded-3xl object-cover"
          />
        </div>
        {session !== null && (
          <Link href={"/priority"}>
            <div className="fixed bottom-28 right-10 flex transform cursor-pointer items-center rounded-full bg-amber-700 p-4 text-white shadow-lg transition-transform hover:bg-[#9B1E47]">
              <span className="mr-2 text-xl">🔢</span>
              <span>Admin Prioirty Queue</span>
            </div>
          </Link>
        )}
        <Link href={"/chat"}>
          <div className="fixed bottom-10 right-10 flex transform cursor-pointer items-center rounded-full bg-[#C24A98FF] p-4 text-white shadow-lg transition-transform hover:bg-[#9B1E47]">
            <span className="mr-2 text-xl">🤖</span>
            <span>Rail Madad AI Chat</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
