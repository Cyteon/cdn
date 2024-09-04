import "./page.css";

import ErrorPage from "@/components/errorPage";
import Redirect from "@/components/redirect";
import Image from "next/image";
import { useRouter } from "next/navigation";
import textExtensions from "text-extensions";
import sizeOf from "image-size";
import { imageExtensions, videoExtensions } from "@/lib/extensions";

export default async function Upload({ params }: { params: { slug: string } }) {
  async function getFile() {
    "use server";

    const fs = require("fs");
    const path = require("path");

    try {
      const file = fs.readFileSync(
        path.join(process.cwd(), "uploads", params.slug),
        "utf8",
      );

      return {
        file,
        filePath: path.join(process.cwd(), "uploads", params.slug),
      };
    } catch (error) {
      console.log(error);

      return { file: undefined, filePath: undefined };
    }
  }

  const { file, filePath } = await getFile();

  if (file === undefined) {
    return <ErrorPage message="404: File not found" />;
  }

  if (textExtensions.includes(params.slug.split(".").pop()!)) {
    return (
      <body className="w-full h-screen">
        <div className="bg-ctp-base w-full  flex flex-row h-screen">
          <div className="select-none text-ctp-text border-r-[1px] border-r-ctp-surface0 p-2 text-right">
            {file.split("\n").map((line: string, index: number) => (
              <div key={index + 1}>{index + 1}</div>
            ))}
          </div>
          <code
            className={
              "text-ctp-text whitespace-pre-wrap break-words p-2 w-full flex flex-col language-" +
              params.slug.split(".").pop()!
            }
            id="code"
          >
            {file}
          </code>
        </div>
      </body>
    );
  } else if (imageExtensions.includes(params.slug.split(".").pop()!)) {
    const dimensions = sizeOf(filePath);
    const { width, height } = dimensions;

    return (
      <html>
        <head>
          <meta
            property="og:image"
            itemProp="image"
            content={process.env.NEXT_PUBLIC_URL + "/r/" + params.slug}
          />
          <meta
            property="og:url"
            content={process.env.NEXT_PUBLIC_URL + "/r/" + params.slug}
          />
          <meta property="og:type" content="image" />
          <meta property="og:image:width" content={width?.toString()} />
          <meta property="og:image:height" content={height?.toString()} />
          <meta property="twitter:card" content="summary_large_image" />
          <meta
            property="twitter:image"
            content={process.env.NEXT_PUBLIC_URL + "/r/" + params.slug}
          />
          <meta name="viewport" content="width=device-width" />
        </head>
        <body>
          <div className="flex justify-center items-center h-screen w-full bg-black">
            <Image
              src={"/r/" + params.slug}
              alt="image"
              layout="responsive"
              width={width || 100}
              height={height || 100}
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
        </body>
      </html>
    );
  } else if (videoExtensions.includes(params.slug.split(".").pop()!)) {
    return (
      <html>
        <head>
          <meta
            property="og:video"
            content={process.env.NEXT_PUBLIC_URL + "/r/" + params.slug}
          />
          <meta
            property="og:url"
            content={process.env.NEXT_PUBLIC_URL + "/r/" + params.slug}
          />
          <meta property="og:type" content="video" />
          <meta property="og:video:width" content="1280" />
          <meta property="og:video:height" content="720" />
          <meta property="twitter:card" content="summary_large_image" />
          <meta
            property="twitter:image"
            content={process.env.NEXT_PUBLIC_URL + "/r/" + params.slug}
          />
          <meta name="viewport" content="width=device-width" />
        </head>
        <body>
          <div className="flex justify-center items-center h-screen w-full bg-black">
            <video
              controls
              className="max-w-full max-h-full"
              src={"/r/" + params.slug}
            />
          </div>
        </body>
      </html>
    );
  } else {
    return <Redirect location={"/r/" + params.slug} />;
  }
}
