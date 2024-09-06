"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";
import NavBar from "@/components/navbar";
import SideBar from "@/components/sidebar";

import { UserDocument } from "@/models/User";

export default function App() {
  const { status, data: session } = useSession();

  const router = useRouter();

  if (status === "loading") {
    return (
      <body>
        <div className="bg-ctp-base w-full h-screen flex items-center justify-center">
          <Loading className="w-32 h-32 fill-ctp-blue" />
        </div>
      </body>
    );
  } else if (
    status === "authenticated" &&
    (session.user as UserDocument).admin === true
  ) {
    return (
      <body className="bg-ctp-base w-full h-screen text-ctp-text min-h-screen flex flex-col">
        <NavBar />
        <div className="flex flex-1">
          <SideBar />
          <aside className="m-4 bg-ctp-mantle p-5 w-full rounded-md border-[1px] border-ctp-surface0">
            <h1 className="text-2xl font-bold">Users</h1>
          </aside>
        </div>
      </body>
    );
  } else {
    router.push("/login");
    return null;
  }
}
