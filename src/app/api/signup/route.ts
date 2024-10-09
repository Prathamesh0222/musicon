import bcrypt from "bcryptjs";
import prisma from "@/config/prisma.config";
import { signUpSchema } from "@/lib/auth-validation";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = signUpSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          message: "Invalid Inputs",
        },
        {
          status: 400,
        }
      );
    }

    const { name, email, password } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return Response.json(
        {
          message: "User already exists",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        password: hashedPassword,
        email,
      },
    });

    return Response.json({
      message: "User created successfully",
      session: user.id,
      token: user.id,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error creating user", error);
    return Response.json(
      {
        success: false,
        message: "Error creating user",
      },
      {
        status: 500,
      }
    );
  }
}
