"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

interface AuthSessionProviderProps {
  children: React.ReactNode;
}

export default function AuthSessionProvider({
  children,
}: AuthSessionProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
