"use client";

import { Button } from "@/components/ui/button";
import { useAnonAuth } from "@/hooks/useAnonAuth";

export default function Home() {
  const { ready, user } = useAnonAuth();
  if (!ready) return null; // можно заменить на спиннер

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">BroMind MVP – v0.1</h1>

      <p className="text-sm">
        UID: <span className="font-mono">{user?.uid}</span>
      </p>

      <Button onClick={() => alert("Дарова, брат! ✌️")}>Say hi</Button>
    </main>
  );
}

