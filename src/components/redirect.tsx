"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Redirect({ location }: { location: string }) {
  const router = useRouter();

  useEffect(() => {
    router.push(location);
  }, [router, location]);

  return null;
}
