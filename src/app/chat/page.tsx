"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { StylePicker } from "@/components/StylePicker";
import { useAnonAuth } from "@/hooks/useAnonAuth";
import { listenMessages, pushMessage } from "@/lib/db";

type Role = "user" | "assistant";

interface Msg {
  id?: string;
  role: Role;
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [style, setStyle] = useState<"bro" | "motivate" | "therapy">("bro");
  const [isTyping, setIsTyping] = useState(false);

  const { user, ready } = useAnonAuth();

  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => bottomRef.current?.scrollIntoView(), [messages]);

  useEffect(() => {
    if (!ready || !user) return;
    const unsub = listenMessages(user.uid, (msgs) =>
      setMessages(msgs as Msg[])
    );
    return unsub;
  }, [ready, user]);

  if (!ready) return null;

  async function send() {
    if (!input.trim()) return;
    const prompt = input;
    setInput("");

    await pushMessage(user!.uid, { role: "user", content: prompt });
    setIsTyping(true);

    const resp = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        style,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const reader = resp.body!.getReader();
    let full = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      full += new TextDecoder().decode(value);
      setMessages((prev) => [
        ...prev.filter((m) => m.role !== "assistant-temp"),
        { role: "assistant-temp" as any, content: full },
      ]);
    }
    setIsTyping(false);
    await pushMessage(user!.uid, { role: "assistant", content: full });
  }

  return (
    <main className="flex flex-col max-w-xl mx-auto p-4 h-screen">
      <StylePicker value={style} onChange={setStyle} />

      <div className="flex-1 overflow-y-auto flex flex-col gap-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`rounded-lg p-2 max-w-[80%] ${
              m.role === "user"
                ? "self-end bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {m.content}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-1 self-start px-2 py-1">
            {[0, 1, 2].map((n) => (
              <span
                key={n}
                className="animate-bounce inline-block"
                style={{ animationDelay: `${n * 0.2}s` }}
              >
                ●
              </span>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 mt-2">
        <input
          className="flex-1 border rounded px-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Напиши брату…"
        />
        <Button onClick={send}>Send</Button>
      </div>
    </main>
  );
}
