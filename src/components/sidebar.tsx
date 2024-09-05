"use client";
import Link from "next/link";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { UserDocument } from "@/models/User";

export default function SideBar() {
  const { data: session } = useSession();

  var [stats, setStats] = useState({
    users: 0,
    files: 0,
    size: 0,
  });

  var storageString: string;

  if (stats.size < 1024) {
    storageString = `${stats.size} B`;
  } else if (stats.size < 1024 * 1024) {
    storageString = `${(stats.size / 1024).toFixed(2)} KB used`;
  } else if (stats.size < 1024 * 1024 * 1024) {
    storageString = `${(stats.size / 1024 / 1024).toFixed(2)} MB used`;
  } else {
    storageString = `${(stats.size / 1024 / 1024 / 1024).toFixed(2)} GB used`;
  }

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
      });
  }, []);

  return (
    <nav className="p-2 bg-ctp-mantle border-r-[1px] border-r-ctp-surface0 w-fit flex flex-col min-w-32">
      <a
        href="/app"
        className="px-5 py-2 transition-all duration-300 hover:bg-ctp-surface0 rounded-md w-full text-start"
      >
        Home
      </a>
      <a
        href="/app/files"
        className="px-5 py-2 transition-all duration-300 hover:bg-ctp-surface0 rounded-md w-full text-start"
      >
        Files
      </a>
      <a
        href="/app/upload"
        className="px-5 py-2 transition-all duration-300 hover:bg-ctp-surface0 rounded-md w-full text-start"
      >
        Upload
      </a>
      {(session?.user as UserDocument).admin && (
        <div className="w-full flex flex-col">
          <hr className="mt-2 border-ctp-surface1" />
          <p className="text-sm text-ctp-subtext0">Administration:</p>
          <a
            href="/app/admin/users"
            className="px-5 py-2 transition-all duration-300 hover:bg-ctp-surface0 rounded-md w-full text-start"
          >
            Users
          </a>
        </div>
      )}

      <div className="text-sm mt-auto">
        <p>Users: {stats.users}</p>
        <p>Files: {stats.files}</p>
        <p>{storageString}</p>
      </div>
    </nav>
  );
}
