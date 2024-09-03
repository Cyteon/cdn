"use server";

import { connectDB } from "@/lib/mongodb";
const { DISABLE_REGISTER } = process.env;
import User from "@/models/User";
import bcrypt from "bcryptjs";

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
    });

    const savedUser = await user.save();
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
};
