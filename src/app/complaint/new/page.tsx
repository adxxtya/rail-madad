/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @next/next/no-img-element */
"use client";
import { Button } from "@/components/ui/button";
import React, { useState, type ChangeEvent } from "react";
import { supabase } from "@/server/supabase";
import { useToast } from "@/hooks/use-toast";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface FormData {
  email: string;
  name: string;
  info: string;
  phoneNumber: string;
  complaintMedia: File | null;
}

const Page: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    name: "",
    info: "",
    phoneNumber: "",
    complaintMedia: null,
  });

  const { toast } = useToast();
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [trackingNumber, setTrackingNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        complaintMedia: file,
      }));
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    if (!formData.complaintMedia) {
      return;
    }

    const file = formData.complaintMedia;
    let fileName = file.name; // Extract the file name

    // Generate random 3-letter string
    const randomString = Math.random()
      .toString(36)
      .substring(2, 5)
      .toUpperCase();

    // Get the file extension
    const fileExtension = fileName.split(".").pop();
    const fileNameWithoutExtension = fileName.replace(`.${fileExtension}`, "");

    // Append random string to the file name
    fileName = `${fileNameWithoutExtension}-${randomString}.${fileExtension}`;

    try {
      const { error } = await supabase.storage
        .from("complaint-media")
        .upload(fileName, file);

      if (error) {
        return toast({
          variant: "destructive",
          description: "Image upload failed",
        });
      }

      const { publicUrl } = supabase.storage
        .from("complaint-media")
        .getPublicUrl(fileName).data;

      try {
        const response = await fetch("/api/complaint/new", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            complaintMediaUrl: publicUrl,
            email: formData.email,
            name: formData.name,
            info: formData.info,
            phoneNumber: formData.phoneNumber,
          }),
        });

        const complaint = await response.json();
        setTrackingNumber(complaint.trackingNumber);
      } catch (error) {
        console.error("Error saving to Database", error);
        toast({
          variant: "destructive",
          description: "Error saving to Database",
        });
      } finally {
        setLoading(false);
      }
      toast({ description: "Uploaded Successfully!" });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An image with the same name might be already submitted.",
      });
    } finally {
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <div className="relative h-[92vh]">
      {loading ? (
        <>
          <div className="absolute left-0 top-0 flex h-screen w-full flex-col items-center justify-center gap-8 bg-transparent text-xl font-bold backdrop-blur-xl">
            <div className="-mt-40 text-3xl">Submitting your complaint</div>
            <div>
              <AiOutlineLoading3Quarters size={100} className="animate-spin" />
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      <img
        src="/trainn.jpg"
        className="scale-x absolute left-0 top-0 -z-20 h-full w-full scale-x-[-1] blur-lg"
        alt="train"
      />
      <div className="absolute left-0 top-0 -z-10 h-full w-full bg-black opacity-50"></div>
      <div className="h-full w-full p-16 pt-12">
        <div className="flex h-full w-full rounded-2xl bg-white">
          {trackingNumber !== null ? (
            <div className="flex h-full w-full items-center justify-center">
              <div className="flex flex-col items-center justify-center text-center">
                <IoCheckmarkDoneCircle
                  size={200}
                  className="-mt-20 text-green-400"
                />
                <div className="mt-4 text-2xl">
                  Your complaint has been successfully registered.
                </div>
                <div className="text-xl">
                  <span className="font-semibold">Your Tracking Number:</span>{" "}
                  {trackingNumber}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Left Side for Media Preview */}
              <div className="flex h-full w-1/2 items-center justify-center rounded-l-2xl bg-slate-100">
                {mediaPreview ? (
                  <div className="flex h-full items-center justify-center rounded-l-2xl">
                    {formData.complaintMedia?.type.startsWith("video") ? (
                      <video
                        src={mediaPreview}
                        controls
                        className="w-full"
                        autoPlay
                        muted
                        loop
                      />
                    ) : (
                      <img
                        src={mediaPreview}
                        alt="Media Preview"
                        className="max-h-full w-full object-cover"
                      />
                    )}
                  </div>
                ) : (
                  <div className="text-gray-500">
                    Upload your complaint&#39;s photo or video to preview here
                  </div>
                )}
              </div>

              {/* Right Side for Form */}
              <div className="flex h-full w-1/2 flex-col justify-center p-16">
                <h2 className="mb-6 text-2xl font-bold">
                  Register Your Complaint
                </h2>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col justify-center gap-3"
                >
                  <label className="text-gray-700">
                    Your Email (for follow-up)
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      className="mt-1 w-full rounded border border-gray-300 p-2"
                      required
                    />
                  </label>

                  <label className="text-gray-700">
                    Your Name (so we know who you are)
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Name"
                      className="mt-1 w-full rounded border border-gray-300 p-2"
                      required
                    />
                  </label>

                  <label className="text-gray-700">
                    Statement (additional info about complaint)
                    <input
                      type="text"
                      name="info"
                      value={formData.info}
                      onChange={handleInputChange}
                      placeholder="Name"
                      className="mt-1 w-full rounded border border-gray-300 p-2"
                      required
                    />
                  </label>

                  <label className="text-gray-700">
                    Phone Number (to contact you)
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Phone Number"
                      className="mt-1 w-full rounded border border-gray-300 p-2"
                      required
                    />
                  </label>

                  <label className="text-gray-700">
                    Complaint Media (photo or video)
                    <input
                      type="file"
                      accept="image/*, video/*"
                      onChange={handleFileChange}
                      className="mt-1 w-full rounded border border-gray-300 p-2"
                      required
                    />
                  </label>

                  <Button type="submit" className="mt-4 h-12 text-lg">
                    Submit Complaint
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
