import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

import { connectDB } from "@/lib/mongodb";
import File from "@/models/File";

const SECRET = process.env.AUTH_SECRET!;

async function post(req: Request) {
  const authHeader = req.headers.get && req.headers.get("authorization");

  const token = authHeader?.split(" ")[1];

  var user;

  if (!token) {
    return new Response(JSON.stringify({ message: "No token provided" }), {
      status: 401,
    });
  }

  try {
    const decodedToken = jwt.verify(token, SECRET);

    user = decodedToken as {
      id: string;
      username: string;
      admin: boolean;
      customToken: string;
    };
  } catch (error) {
    return new Response(JSON.stringify({ message: "Invalid token" }), {
      status: 401,
    });
  }

  let uploadDir = path.join(process.cwd(), "uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (file.name == "") {
    return new Response(JSON.stringify({ message: "No file provided" }), {
      status: 400,
    });
  }

  const id = Math.random().toString(36).substring(6);
  const fileName = `${id}.${file?.name.split(".").pop()}`;
  const filePath = path.join(uploadDir, fileName);

  try {
    await connectDB();

    const fileDoc = new File({
      fileName: file?.name,
      owner: user.id,
      id: fileName,
    });

    await fileDoc.save();
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify({ message: "Error saving file" }), {
      status: 500,
    });
  }

  const reader = file?.stream().getReader();
  const writer = fs.createWriteStream(filePath, { flags: "w" });

  const write: any = async ({ done, value }: any) => {
    if (done) {
      writer.close();
      return;
    }

    writer.write(value);
    return reader.read().then(write);
  };

  await reader.read().then(write);

  return new Response(
    JSON.stringify({
      message: "File uploaded",
      url: process.env.NEXT_PUBLIC_URL + "/u/" + fileName,
    }),
    {
      status: 200,
    },
  );
}

export { post as POST };
