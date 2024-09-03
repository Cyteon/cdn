// app/api/download/route.js
import fs from "fs";
import path from "path";

export async function GET(req, { params }: { params: { slug: string } }) {
  const slug = params.slug;

  if (!slug) {
    return new Response(JSON.stringify({ error: "File name is required" }), {
      status: 400,
    });
  }

  const filePath = path.join(process.cwd(), "uploads", slug);

  try {
    const fileBuffer = fs.readFileSync(filePath);
    return new Response(fileBuffer, {
      headers: {
        "Content-Disposition": `attachment; filename="${path.basename(filePath)}"`,
        "Content-Type": "application/octet-stream",
      },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "File not found" }), {
      status: 404,
    });
  }
}
