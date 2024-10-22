/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/server/db";
import Link from "next/link";

const page = async () => {
  // Fetch complaints from the database
  const complaints = await db.complaint.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  // Function to render media preview
  const renderMediaPreview = (mediaUrl: string) => {
    const isVideo =
      mediaUrl.endsWith(".mp4") ||
      mediaUrl.endsWith(".mov") ||
      mediaUrl.endsWith(".avi");

    if (isVideo) {
      return (
        <video
          className="max-h-12 rounded"
          // controls
          muted
          // onClick={(e) => {
          //   e.stopPropagation(); // Prevent row click
          // }}
        >
          <source src={mediaUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return (
        <img
          src={mediaUrl}
          alt="Media Preview"
          className="max-h-12 rounded object-cover"
        />
      );
    }
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="mt-8 text-center text-3xl font-bold">
        All the recent complaints
      </div>
      <div className="p-8">
        <Table className="rounded-2xl border">
          <TableCaption>A list of all recent complaints.</TableCaption>
          <TableHeader className="bg-slate-300">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Complaint Statement</TableHead>
              <TableHead>Complaint Media</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {complaints.map((complaint) => (
              <TableRow key={complaint.id}>
                <TableCell className="font-medium">{complaint.name}</TableCell>

                <Link href={`/complaint/all/${complaint.id}`}>
                  <TableCell className="font-medium hover:underline">
                    {complaint.info}
                  </TableCell>
                </Link>
                <TableCell>
                  <div className="flex items-center">
                    {renderMediaPreview(complaint.complaintMediaUrl)}
                    <a
                      href={complaint.complaintMediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600"
                    >
                      View Media
                    </a>
                  </div>
                </TableCell>
                <TableCell>{complaint.createdAt.toString()}</TableCell>
                <TableCell>{complaint.updatedAt.toString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default page;
