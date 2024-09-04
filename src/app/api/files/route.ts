import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

import { connectDB } from "@/lib/mongodb";
import Image from "@/models/Image";

const SECRET = process.env.AUTH_SECRET!;

async function get(req: Request) {
  const authHeader =
    req.headers["authorization"] ||
    req.headers["Authorization"] ||
    (req.headers.get && req.headers.get("authorization"));

  const token = authHeader?.split(" ")[1];

  var user;

  if (!token) {
    return new Response(JSON.stringify({ message: "No token provided" }), {
      status: 401,
    });
  }

  try {
    const decodedToken = jwt.verify(token, SECRET);

    user = decodedToken;
  } catch (error) {
    return new Response(JSON.stringify({ message: "Invalid token" }), {
      status: 401,
    });
  }

  await connectDB();

  const images = await Image.find({ owner: user.id });

  return new Response(JSON.stringify(images), {
    status: 200,
  });
}

export { get as GET };
