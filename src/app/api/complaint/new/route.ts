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

    // Create a new journal and journal note
    const newComplaint = await db.complaint.create({
      data: {
        complaintMediaUrl: complaintMediaUrl,
        email: email,
        name: name,
        phoneNumber: phoneNumber,
        info: info,
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
