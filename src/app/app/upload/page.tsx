"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Cookies } from "typescript-cookie";

import Loading from "@/components/loading";
import NavBar from "@/components/navbar";
import SideBar from "@/components/sidebar";

export default function App() {
  const { status, data: session } = useSession();

  const router = useRouter();

  console.log(session);

  const uploadFile = async (e) => {
    e.preventDefault();
    const file = e.target.file?.files[0];

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
      headers: {
        authorization: `Bearer ${session?.user?.customToken}`,
      },
    });

    const body = await res.json();

    if (res.ok) {
      Swal.fire({
        title: "Uploaded",
        text: body.url,
        icon: "success",
        background: "#363a4f",
      });
    } else {
      Swal.fire({
        title: "Error",
        text: body.message,
        icon: "error",
        background: "#363a4f",
      });
    }
  };

  if (status === "loading") {
    return (
      <body className="bg-ctp-base w-full h-screen min-h-screen flex items-center justify-center">
        <Loading />
      </body>
    )
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
              <button className="p-2 bg-ctp-blue text-ctp-crust rounded-md">
                Upload
              </button>
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
