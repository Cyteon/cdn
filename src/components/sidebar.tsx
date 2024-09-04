import Link from "next/link";

export default function SideBar() {
  return (
    <nav className="py-4 px-2 bg-ctp-mantle border-r-[1px] border-r-ctp-surface0 w-fit flex flex-col min-w-32">
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
    </nav>
  );
}
