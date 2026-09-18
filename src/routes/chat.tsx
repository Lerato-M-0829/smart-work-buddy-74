import { createFileRoute } from "@tanstack/react-router";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AiDisclaimer, AppShell, PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { chatReply, delay } from "@/lib/mock-ai";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Assistant Chat — WorkFlow AI" },
      {
        name: "description",
        content:
          "Chat with an AI workplace assistant for writing help, formatting, process questions and problem-solving.",
      },
      { property: "og:title", content: "AI Assistant Chat — WorkFlow AI" },
      {
        property: "og:description",
        content: "A conversational workplace assistant for everyday work questions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatPage,
});

type Msg = { id: number; role: "user" | "assistant"; text: string };

const suggestions = [
  "Help me structure a project update",
  "How do I say no to a meeting politely?",
  "Turn my rough notes into bullet points",
];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 0,
      role: "assistant",
      text: "Hi Alex — I'm your workplace assistant. Ask me about writing, formatting, planning or working through a problem.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function send(text: string) {
    const value = text.trim();
    if (!value || typing) return;
    const turn = messages.filter((m) => m.role === "user").length;
    setMessages((prev) => [...prev, { id: Date.now(), role: "user", text: value }]);
    setInput("");
    setTyping(true);
    await delay(900);

    const full = chatReply(value, turn);
    const id = Date.now() + 1;
    setMessages((prev) => [...prev, { id, role: "assistant", text: "" }]);
    setTyping(false);

    for (let i = 1; i <= full.length; i += 3) {
      await delay(12);
      const partial = full.slice(0, i);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, text: partial } : m)));
    }
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, text: full } : m)));
    inputRef.current?.focus();
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          icon={Bot}
          title="AI Assistant"
          description="Real-time help with writing, formatting and everyday workplace problem-solving."
        />

        <Card className="flex h-[calc(100vh-19rem)] min-h-[26rem] flex-col overflow-hidden p-0">
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <span className="brand-gradient mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg text-primary-foreground">
                    <Sparkles className="size-4" />
                  </span>
                )}
                <div
                  className={`max-w-[80%] text-sm leading-relaxed ${
                    m.role === "user"
                      ? "rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-primary-foreground"
                      : "text-foreground"
                  }`}
                >
                  {m.text || <span className="text-muted-foreground">…</span>}
                </div>
                {m.role === "user" && (
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <User className="size-4" />
                  </span>
                )}
              </div>
            ))}
            {typing && (
              <div className="flex items-center gap-3">
                <span className="brand-gradient flex size-8 shrink-0 items-center justify-center rounded-lg text-primary-foreground">
                  <Sparkles className="size-4" />
                </span>
                <span className="animate-pulse text-sm text-muted-foreground">Thinking…</span>
              </div>
            )}
          </div>

          <CardContent className="space-y-3 border-t border-border p-3 sm:p-4">
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <Button key={s} size="sm" variant="outline" onClick={() => send(s)}>
                    {s}
                  </Button>
                ))}
              </div>
            )}
            <div className="flex items-end gap-2">
              <Textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder="Ask anything about your work…"
                className="max-h-32 min-h-11 resize-none"
              />
              <Button
                size="icon"
                className="size-11 shrink-0"
                onClick={() => send(input)}
                disabled={typing || !input.trim()}
                aria-label="Send message"
              >
                <Send className="size-4" />
              </Button>
            </div>
            <AiDisclaimer />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
