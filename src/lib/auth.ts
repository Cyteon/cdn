import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({
          username: credentials?.username,
        }).select("+password");
        if (!user) throw new Error("No user found");
        const passwordMatch = await bcrypt.compare(
          credentials!.password,
          user.password,
        );
        if (!passwordMatch) throw new Error("Invalid Password");

        const customToken = jwt.sign(
          { id: user.id, username: user.username, admin: user.admin },
          process.env.AUTH_SECRET!,
          { expiresIn: "28d" },
        );

        return {
          id: user.id,
          admin: user.admin,
          username: user.username,
          customToken: customToken,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.admin = user.admin;
        token.username = user.username;
        token.customToken = user.customToken;
      }
      return token;
    },
    async session({ session, token }) {
      await connectDB();

      const user = await User.findOne({ id: token.id });

      if (!user) return;

      session.user = {
        id: token.id,
        admin: user.admin,
        username: user.username,
        customToken: token.customToken,
      };
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
};
