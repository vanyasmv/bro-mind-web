"use client";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background text-foreground">
      <h1 className="text-3xl font-bold tracking-tight">
        BroMind MVP – v0.1
      </h1>
      <p className="text-center max-w-md">
        Нажми кнопку и поздоровайся с&nbsp;братиком-ИИ.
      </p>
      <Button onClick={() => alert("Дарова, брат! ✌️")}>Say hi</Button>
    </main>
  );
}
