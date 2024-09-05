import { connectDB } from "@/lib/mongodb";
import { promisify } from "util";

const fastFolderSize = require("fast-folder-size");

import User from "@/models/User";
import File from "@/models/File";

const fastFolderSizeAsync = promisify(fastFolderSize);

async function get(req: Request) {
  await connectDB();

  var users: number;
  var files: number;

  users = await User.countDocuments();
  files = await File.countDocuments();

  let storageUsed: number;
  try {
    storageUsed = await fastFolderSizeAsync("uploads");
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ message: "Error getting storage" }), {
      status: 500,
    });
  }

  return new Response(
    JSON.stringify({
      users,
      files,
      size: storageUsed,
    }),
    { status: 200 },
  );
}

export { get as GET };
