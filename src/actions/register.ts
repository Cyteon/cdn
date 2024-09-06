"use server";

import { connectDB } from "@/lib/mongodb";
const { DISABLE_REGISTER } = process.env;
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { typeid } from "typeid-ts";

export const register = async (values: any) => {
  const { username, password } = values;

  try {
    await connectDB();

    if (DISABLE_REGISTER == "true") {
      return {
        error: "Registration is disabled",
      };
    }

    const userFound = await User.findOne({ username });

    if (userFound) {
      return {
        error: "User already exists",
      };
    }

    if (!username || !password) {
      return {
        error: "Username and password are required",
      };
    }

    if (password.length < 6) {
      return {
        error: "Password must be at least 6 characters",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      id: typeid("user"),
      password: hashedPassword,
    });

    const savedUser = await user.save();
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
};
