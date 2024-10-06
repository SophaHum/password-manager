"use client";

import { signIn } from "next-auth/react";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to Password Manager</h1>
      <button
        className="rounded-md bg-blue-500 p-4 text-white"
        onClick={() => signIn()}
      >
        Login with Google
      </button>
    </main>
  );
}
