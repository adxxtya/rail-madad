/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { db } from "@/server/db";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const {
      usernameRegister,
      emailRegister,
      passwordRegister,
      userOptedForUpdates,
      userAgreedForTerms,
    } = await req.json();
    const hashed = await hash(passwordRegister, 12);

    const user = await db.user.create({
      data: {
        username: usernameRegister,
        email: emailRegister,
        password: hashed,
      },
    });

    return NextResponse.json({
      user: {
        email: user.email,
      },
    });
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        const meta = err.meta as { target: string[] } | undefined;
        const targetField = meta?.target?.[0];

        let errorMessage = "An unexpected error occurred.";
        if (targetField === "username") {
          errorMessage = "Username already taken.";
        } else if (targetField === "email") {
          errorMessage = "Email already exists.";
        }

        return new NextResponse(JSON.stringify({ error: errorMessage }), {
          status: 400,
        });
      }
    }

    return new NextResponse(
      JSON.stringify({
        error: "An unexpected error occurred.",
      }),
      {
        status: 500,
      },
    );
  }
}
