"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const res = await signIn("credentials", {
      redirect: false,
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    });

    if (res?.error) {
      setError(res.error as string);
    } else if (res?.ok) {
      return router.push("/app");
    }
  };

  return (
    <section className="w-full h-screen flex items-center justify-center bg-ctp-base text-ctp-text">
      <form
        className="w-96 p-4 bg-ctp-surface0 rounded-lg shadow-lg "
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold my-2">Login</h1>

        <label>Username</label>
        <input
          type="text"
          name="username"
          className="w-full p-2 rounded-lg bg-ctp-crust"
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          className="w-full p-2 rounded-lg bg-ctp-crust"
        />

        <p className="text-ctp-red my-1 text-sm">{error}</p>

        <button
          type="submit"
          className="w-full p-2 bg-ctp-blue text-ctp-crust rounded-lg"
        >
          Login
        </button>

        <p className="text-sm text-ctp-subtext0 my-1">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-ctp-blue ">
            Register
          </Link>
        </p>
      </form>
    </section>
  );
}
