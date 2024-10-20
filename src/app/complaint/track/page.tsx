/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @next/next/no-img-element */
"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Page: React.FC = () => {
  const { toast } = useToast();
  const [trackingNumber, setTrackingNumber] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [complaintDetails, setComplaintDetails] = useState<any>(null); // Adjust type as necessary

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTrackingNumber(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setComplaintDetails(null); // Reset previous details

    try {
      const response = await fetch(`/api/complaint/track`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trackingNumber }),
      });

      if (!response.ok) {
        throw new Error("No such complaint exists");
      }

      const data = await response.json();
      setComplaintDetails(data.complaint);
      console.log("data", data);
    } catch (error) {
      console.error("Error fetching complaint details:", error);
      toast({
        variant: "destructive",
        description: "Failed to fetch complaint details. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderMedia = (mediaUrl: string) => {
    const isVideo =
      mediaUrl.endsWith(".mp4") ||
      mediaUrl.endsWith(".mov") ||
      mediaUrl.endsWith(".avi");

    if (isVideo) {
      return (
        <video controls className="max-h-96 rounded object-cover">
          <source src={mediaUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return (
        <img
          src={mediaUrl}
          alt="Media Preview"
          className="max-h-96 rounded object-cover"
        />
      );
    }
  };

  return (
    <div className="relative h-[92vh]">
      <img
        src="/trainn.jpg"
        className="scale-x absolute left-0 top-0 -z-20 h-full w-full scale-x-[-1] blur-lg"
        alt="train"
      />
      <div className="absolute left-0 top-0 -z-10 h-full w-full bg-black opacity-50"></div>
      <div className="h-full w-full p-20 pt-12">
        <div className="flex h-full w-full flex-col rounded-2xl bg-white">
          <>
            <form
              onSubmit={handleSubmit}
              className="my-12 flex w-full justify-center gap-6"
            >
              <label className="text-gray-700">
                Your Tracking Number:
                <input
                  type="text"
                  name="trackingNumber"
                  value={trackingNumber}
                  onChange={handleInputChange}
                  placeholder="Unique Tracking ID"
                  className="mt-1 w-full rounded border border-gray-300 p-2"
                  required
                />
              </label>

              <Button type="submit" className="mt-4 h-12 self-end text-lg">
                Track Complaint
              </Button>
            </form>

            {/* Left Side for Media Preview and Complaint Details */}
            <div className="flex h-full w-full flex-col items-center justify-center rounded-l-2xl bg-slate-100">
              {loading && <p>Loading...</p>}
              {complaintDetails && (
                <div className="flex w-full p-0">
                  <div className="-mt-12 ml-20 flex w-full flex-col justify-center gap-3 p-4 text-xl">
                    <h3 className="text-3xl font-bold">Complaint Details</h3>
                    <p>
                      <strong>Name:</strong> {complaintDetails.name}
                    </p>
                    <p>
                      <strong>Statement:</strong> {complaintDetails.info}
                    </p>
                    <p>
                      <strong>Email:</strong> {complaintDetails.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {complaintDetails.phoneNumber}
                    </p>
                  </div>
                  <div className="w-full p-0">
                    <div className="w-full">
                      {complaintDetails.complaintMediaUrl &&
                        renderMedia(complaintDetails.complaintMediaUrl)}
                    </div>
                  </div>
                </div>
              )}
              {!loading && !complaintDetails && (
                <p>The Tracking Result Will Be Shown Here</p>
              )}
            </div>
          </>
        </div>
      </div>
    </div>
  );
};

export default Page;
