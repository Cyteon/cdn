"use client";

import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Cookies } from "typescript-cookie";

import Loading from "@/components/loading";
import NavBar from "@/components/navbar";
import SideBar from "@/components/sidebar";
import axios from "axios";
import { UserDocument } from "@/models/User";

export default function App() {
  const { status, data: session } = useSession();

  var [uploading, setUploading] = useState(false);

  const router = useRouter();

  console.log(session);

  const uploadFile = async (e: any) => {
    e.preventDefault();

    const btn = e.target.querySelector("button");
    btn.disabled = true;

    setUploading(true);

    const file = e.target.file?.files[0];

    const formData = new FormData(e.currentTarget);
    formData.append("file", file);

    try {
      let startTime: number,
        lastUploadedBytes = 0;

      const res = await axios.post("/api/upload", formData, {
        headers: {
          authorization: `Bearer ${(session?.user as { customToken: string }).customToken}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 0),
          );

          const bar = e.target.querySelector("#progress-bar");

          if (bar) {
            bar.style.width = percentCompleted + "%";
          }

          const currentTime = Date.now();

          if (!startTime) {
            startTime = currentTime;
          }

          const uploadedBytes = progressEvent.loaded;
          const totalBytes = progressEvent.total;

          const timeElapsed = (currentTime - startTime) / 1000;

          const bytesSinceLastProgress = uploadedBytes - lastUploadedBytes;
          const uploadSpeedMbps =
            (bytesSinceLastProgress * 8) / (timeElapsed * 1000000);

          lastUploadedBytes = uploadedBytes;

          btn.innerText = `${uploadSpeedMbps.toFixed(2)} MB/s`;
        },
      });

      const body = await res.data;

      if (res.status === 200) {
        Swal.fire({
          title: "Uploaded",
          text: body.message,
          icon: "success",
          background: "#363a4f",
          confirmButtonText: "Copy URL",
          cancelButtonText: "OK",
          showCancelButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            navigator.clipboard.writeText(body.url);

            Swal.fire({
              title: "Copied",
              text: 'The URL "' + body.url + '" has been copied to your url',
              icon: "success",
              background: "#363a4f",
            });
          }
        });
      } else {
        Swal.fire({
          title: "Error",
          text: body.message,
          icon: "error",
          background: "#363a4f",
        });
      }
    } catch (err: any) {
      Swal.fire({
        title: "Error",
        text: err.message,
        icon: "error",
        background: "#363a4f",
      });
    }

    btn.disabled = false;
    btn.innerText = "Upload";
    setUploading(false);
  };

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
          <aside className="m-4 bg-ctp-mantle p-5 w-full rounded-md border-[1px] border-ctp-surface0">
            <h1 className="text-2xl font-bold">Upload</h1>
            <form
              className="flex-col flex w-fit file:bg-ctp-surface0 file:text-ctp-text"
              onSubmit={uploadFile}
            >
              <input
                type="file"
                name="file"
                id="file"
                className="border-ctp-surface0 border-[1px] p-2 rounded-md my-2"
              />
              <button className="p-2 bg-ctp-blue text-ctp-crust rounded-md disabled:bg-ctp-overlay0 disabled:text-ctp-text">
                {uploading ? "Uploading..." : "Upload"}
              </button>
              {uploading ? (
                <div className="bg-ctp-surface1 h-3 rounded-xl mt-2 w-full">
                  <div
                    className="bg-ctp-green h-full rounded-xl"
                    id="progress-bar"
                    style={{ width: "10%" }}
                  ></div>
                </div>
              ) : null}
            </form>
          </aside>
        </div>
      </body>
    );
  } else {
    router.push("/login");
    return null;
  }
}
