"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";
import NavBar from "@/components/navbar";
import SideBar from "@/components/sidebar";
import { useEffect, useState } from "react";
import Image from "next/image";

import { imageExtensions } from "@/lib/extensions";

export default function Files() {
  const { status, data: session } = useSession();

  var [files, setFiles] = useState([]);

  var images = files.filter((file) =>
    imageExtensions.includes(file.id.split(".").pop()),
  );

  var other = files.filter(
    (file) => !imageExtensions.includes(file.id.split(".").pop()),
  );

  const router = useRouter();

  const getFiles = async () => {
    const res = await fetch("/api/files", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${session?.user?.customToken}`,
      },
    });

    const data = await res.json();

    console.log(data);

    setFiles(data);
  };

  useEffect(() => {
    if (session?.user?.customToken) {
      console.log("getting files");
      getFiles();
    }
  }, [session]);

  if (status === "loading") {
    return (
      <body>
        <div className="bg-ctp-base w-full h-screen flex items-center justify-center">
          <Loading />
        </div>
      </body>
    );
  } else if (status === "authenticated") {
    return (
      <body className="bg-ctp-base w-full h-screen text-ctp-text min-h-screen flex flex-col">
        <NavBar />
        <div className="flex flex-1">
          <SideBar />
          <aside className="m-4 bg-ctp-mantle p-5 w-full rounded-md border-[1px] border-ctp-surface0 ">
            <div className="flex flex-wrap gap-2">
              {images.map((file, index) => (
                <div key={index} className="flex-shrink-1">
                  <Image
                    src={"/r/" + file.id}
                    alt={file.fileName}
                    layout="intrinsic"
                    width={256}
                    height={256}
                    className="max-w-md h-auto size-fit"
                  />
                </div>
              ))}
              {other.map((file, index) => (
                <a
                  key={index}
                  href={process.env.NEXT_PUBLIC_URL + "/r/" + file.id}
                  target="_blank"
                  rel="noreferrer"
                  className="p-5 bg-ctp-surface0 rounded-md max-w-md size-fit flex-shrink-1"
                >
                  {file.fileName}
                </a>
              ))}
            </div>
          </aside>
        </div>
      </body>
    );
  } else {
    router.push("/login");
    return null;
  }
}
