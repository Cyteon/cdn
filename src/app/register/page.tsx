"use client";

import { FormEvent, useState, useRef } from "react";
import { register } from "@/actions/register";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Loading from "@/components/loading";

export default function Register() {
  const [error, setError] = useState("");
  const router = useRouter();
  const ref = useRef<HTMLFormElement>(null);

  var [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);

    const r = await register({
      password: formData.get("password"),
      username: formData.get("username"),
    });

    ref.current?.reset();

    if (r?.error) {
      setError(r.error);

      setLoading(false);
      return;
    } else {
      return router.push("/login");
    }
  };

  return (
    <section className="w-full h-screen flex items-center justify-center bg-ctp-base text-ctp-text">
      <form
        className="w-96 p-4 bg-ctp-surface0 rounded-lg shadow-lg "
        ref={ref}
        action={handleSubmit}
      >
        <h1 className="text-2xl font-bold my-2">Register</h1>
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
          {loading ? (
            <Loading className="w-8 h-8 mx-auto fill-ctp-green" />
          ) : (
            "Register"
          )}
        </button>

        <p className="text-sm text-ctp-subtext0 my-1">
          Have an account?{" "}
          <Link href="/login" className="text-ctp-blue">
            Login
          </Link>
        </p>
      </form>
    </section>
  );
}
