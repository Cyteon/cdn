"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/navbar";
import SideBar from "@/components/sidebar";

export default function App() {
  const { status, data: session } = useSession();

  const router = useRouter();

  if (status === "loading") {
    return <p>Loading...</p>;
  } else if (status === "authenticated") {
    return (
      <body className="bg-ctp-base w-full h-screen text-ctp-text min-h-screen flex flex-col">
        <NavBar />
        <div className="flex flex-1">
          <SideBar />
          <aside className="m-4 bg-ctp-mantle p-5 w-full rounded-md border-[1px] border-ctp-surface0">
            <h1 className="text-2xl font-bold">
              Hi, {session?.user?.username}
            </h1>
          </aside>
        </div>
      </body>
    );
  } else {
    router.push("/login");
    return null;
  }
}
