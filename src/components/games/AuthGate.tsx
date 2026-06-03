"use client";

import { useAuth } from "@/lib/auth-context";
import LoginForm from "./LoginForm";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

export default function AuthGate({ children }: { children: ReactNode }) {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <LoginForm />;
  }

  return <>{children}</>;
}
