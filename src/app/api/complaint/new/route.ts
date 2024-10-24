/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-floating-promises */

import { db } from "@/server/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, name, phoneNumber, info, complaintMediaUrl } =
      await req.json();

    // Add POST request to another endpoint
    const response = await fetch(
      `https://7dw5tzcs-5000.inc1.devtunnels.ms/classify?image_url=${complaintMediaUrl}`,
    );

    if (!response.ok) {
      throw new Error("Failed to send data to external endpoint");
    }

    console.log("response,  ", response);

    const aiMlSummary = await response.json();

    const newComplaint = await db.complaint.create({
      data: {
        complaintMediaUrl,
        email,
        name,
        phoneNumber,
        info,
        summary: aiMlSummary.summary,
        category: aiMlSummary.problem_category,
      },
    });

    return NextResponse.json({
      trackingNumber: newComplaint.id,
      success: "New complaint saved.",
    });
  } catch (err: any) {
    return new NextResponse(
      JSON.stringify({
        error: err.message,
      }),
      {
        status: 500,
      },
    );
  }
}
