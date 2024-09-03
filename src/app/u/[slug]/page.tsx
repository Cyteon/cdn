import "./page.css";

import ErrorPage from "@/components/errorPage";
import Redirect from "@/components/redirect";
import Image from "next/image";
import { useRouter } from "next/navigation";
import textExtensions from "text-extensions";

const imageExtensions = ["png", "jpg", "jpeg", "gif", "webp", "svg"];

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

      return file;
    } catch (error) {
      console.log(error);

      return undefined;
    }
  }

  const file = await getFile();

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
    return (
      <html>
        <head>
          <meta
            property="og:image"
            content={process.env.NEXT_PUBLIC_URL + "/get/" + params.slug}
          />
          <meta property="og:type" content="website" />
          <meta name="viewport" content="width=device-width" />
        </head>
        <body className="bg-black">
          <Image
            src={"/get/" + params.slug}
            alt="image"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "auto", height: "auto" }}
          />
        </body>
      </html>
    );
  } else {
    return <Redirect location={"/get/" + params.slug} />;
  }
}
