/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "../config/prisma.config";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { signInSchema } from "./auth-validation";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "john@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "123456",
        },
      },
      async authorize(credentials): Promise<any> {
        const result = signInSchema.safeParse(credentials);

        if (!result.success) {
          throw new Error("Invalid inputs");
        }

        const { email, password } = result.data;

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          throw new Error("No user found with this email");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid Password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      async profile(profile) {
        return {
          id: profile.sub as string,
          name: profile.name as string,
          email: profile.email as string,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (!profile?.email) {
        throw new Error("No email found in profile");
      }

      const hashedPassword = await bcrypt.hash("password", 10);
      await prisma.user.upsert({
        where: {
          email: profile.email,
        },
        update: {
          email: profile.email,
          name: profile.name,
        },
        create: {
          email: profile.email,
          name: profile.name,
          password: hashedPassword,
        },
      });

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  pages: {
    signIn: "/signin",
  },
};
