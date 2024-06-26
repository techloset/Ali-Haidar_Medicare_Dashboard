import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/config/prisma";
import { getServerSession } from "next-auth";

export const POST = async (request: NextRequest) => {
  try {
    const {
      email,
      password,
      userName,
      companyName,
      employees,
      industryName,
      confirmPassword,
    } = await request.json();

    if (
      !email ||
      !password ||
      !userName ||
      !companyName ||
      !employees ||
      !industryName ||
      !confirmPassword
    ) {
      return new NextResponse("please fill all the fields", {
        status: 400,
      });
    }

    const exist = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (exist) {
      console.log("user already exist");
      return new NextResponse("User already exists", {
        status: 400,
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    try {
      const user = await prisma.users.create({
        data: {
          email: email,
          password: hashPassword,
          userName: userName,
          companyName: companyName,
          employees: employees,
          industryName: industryName,
          confirmPassword: confirmPassword,
        },
      });

      console.log("Created user:", user);

      return new NextResponse(JSON.stringify({ data: user, success: true }), {
        status: 200,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return new NextResponse(JSON.stringify(error), { status: 400 });
    }
  } catch (error) {
    console.error("Error parsing request:", error);
    return new NextResponse("Internal Server Error", {
      status: 500,
    });
  }
};


export async function GET(req: NextRequest ): Promise<NextResponse> {
  try {
    const session = await getServerSession();

    console.log("session", session);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userEmail = session.user?.email;

    if (!userEmail) {
      return new NextResponse("User email not found", { status: 400 });
    }

    const userData = await prisma.users.findFirst({
      where: {
        email: {
          equals: userEmail,
        },
      },
    });

    if (!userData) {
      return new NextResponse("User data not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify(userData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

