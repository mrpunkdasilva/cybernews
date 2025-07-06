"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="w-24 h-10 bg-gray-700 animate-pulse rounded-md"></div>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt={session.user.name || "User Avatar"}
            width={40}
            height={40}
            className="rounded-full border-2 border-cyan-400"
          />
        )}
        <span className="text-cyan-300 font-mono">{session.user?.name}</span>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 text-sm font-bold text-black bg-cyan-400 rounded-md hover:bg-cyan-500 transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("github")}
      className="px-4 py-2 text-sm font-bold text-black bg-cyan-400 rounded-md hover:bg-cyan-500 transition-colors"
    >
      Sign in with GitHub
    </button>
  );
}
