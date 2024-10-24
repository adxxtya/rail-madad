/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { redirect } from "next/navigation";
import React from "react";
import ReactMarkdown from "react-markdown"; // Import ReactMarkdown

const ProfilePage = async () => {
  const session = await getServerAuthSession();

  if (!session) redirect("/");

  // Fetch complaints from the database
  const complaints = await db.complaint.findMany();

  // Extract the 'info' field from each complaint object
  const complaintInfos = complaints.map((complaint) => complaint.info);

  // Send POST request with extracted complaint info
  const response = await fetch(
    `https://7dw5tzcs-5000.inc1.devtunnels.ms/prioritize_complaints`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        complaints: complaintInfos, // Send the 'info' field array
      }),
    },
  );

  const data = await response.json();

  if (!data) {
    console.log("No data received.");
  }

  // Check if prioritized complaints exist
  const prioritizedComplaints = data?.prioritized_complaints ?? [];

  console.log("pc", prioritizedComplaints);

  return (
    <div className="flex w-full justify-center p-8">
      <div className="container mx-auto w-full">
        <h1 className="mb-4 text-2xl font-bold">
          Welcome, {session.user?.email ?? "N/A"}
        </h1>

        {/* Display user session details */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold">Profile Information</h2>
          <p>
            <strong>Email:</strong> {session.user?.email ?? "N/A"}
          </p>
        </div>

        {/* Display prioritized complaints */}
        <div>
          <h2 className="text-xl font-semibold">Complaint Priority List</h2>

          {/* Only display if there are prioritized complaints */}
          {prioritizedComplaints && prioritizedComplaints.length > 0 ? (
            <ul className="mt-6 rounded bg-gray-200 p-4">
              {prioritizedComplaints.map((complaint: string, index: number) => (
                <li key={index} className="mb-2">
                  <ReactMarkdown>{complaint}</ReactMarkdown>
                </li>
              ))}
            </ul>
          ) : (
            <p>The complaint priority queue is being fetched....</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
