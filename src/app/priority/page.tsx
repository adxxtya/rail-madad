/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

const ProfilePage = async () => {
  const session = await getServerAuthSession();

  // Redirect if no session (user not logged in)
  if (!session) redirect("/");

  // Fetch request to the external API
  // const response = await fetch(
  //   `https://7dw5tzcs-5000.inc1.devtunnels.ms/classify`,
  // );
  // const data = await response.json();

  // if (!data) {
  //   console.log("Hey");
  // }

  return (
    <div className="w-fulll flex justify-center p-8">
      <div className="container mx-auto w-full">
        <h1 className="mb-4 text-2xl font-bold">
          Welcome, {session.user?.email ?? "N/A"}
        </h1>

        {/* Display user session details */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold">Profile Information</h2>
          <p>
            <strong>Username:</strong> {session.user?.username ?? "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {session.user?.email ?? "N/A"}
          </p>
        </div>

        {/* Display fetched data */}
        <div>
          <h2 className="text-xl font-semibold">Complaint Priority List</h2>
          <pre className="mt-6 rounded bg-gray-200 p-4">
            {/* {JSON.stringify(data, null, 2)} */}
            The complaint prioirty queue is being fetched....
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
