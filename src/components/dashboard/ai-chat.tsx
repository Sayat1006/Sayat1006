"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, Bot, Copy, RotateCcw, Send, Sparkles, User } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { getMockAssistantReply } from "@/lib/dashboard/mock-data";
import type { ChatMessage } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

interface AiChatProps {
  initialMessages: ChatMessage[];
  quickPrompts?: string[];
}

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `msg-${Date.now()}-${idCounter}`;
}

function AiChat({ initialMessages, quickPrompts = [] }: AiChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const replyIndex = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    setMessages((prev) => [...prev, { id: nextId(), role: "user", content: trimmed }]);
    setInput("");
    setIsTyping(true);

    window.setTimeout(() => {
      const reply = getMockAssistantReply(replyIndex.current);
      replyIndex.current += 1;
      setMessages((prev) => [...prev, { id: nextId(), role: "assistant", content: reply }]);
      setIsTyping(false);
    }, 1300);
  }

  function handleRegenerate(messageId: string) {
    setIsTyping(true);
    window.setTimeout(() => {
      const reply = getMockAssistantReply(replyIndex.current);
      replyIndex.current += 1;
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, content: reply } : m)),
      );
      setIsTyping(false);
    }, 1000);
  }

  async function handleCopy(content: string) {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Жауап көшірілді");
    } catch {
      toast.error("Көшіру мүмкін болмады");
    }
  }

  function handleSave() {
    toast.success("Материалдарға сақталды");
  }

  return (
    <div className="flex h-[calc(100vh-11rem)] min-h-[520px] flex-col overflow-hidden rounded-2xl border border-primary/10 bg-surface shadow-soft lg:h-[calc(100vh-9rem)]">
      <div className="flex items-center gap-2.5 border-b border-primary/8 bg-[#fbfcfe] px-5 py-4">
        <span className="inline-flex size-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-cyan),var(--color-violet))] text-white">
          <Bot className="size-4.5" />
        </span>
        <div>
          <p className="text-sm font-semibold text-primary">S-AI Көмекші</p>
          <p className="text-xs text-success">Желіде</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn("flex gap-2", message.role === "user" ? "justify-end" : "justify-start")}
          >
            {message.role === "assistant" ? (
              <span className="mt-1 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-cyan/15 text-[#0b7ea8]">
                <Bot className="size-3.5" />
              </span>
            ) : null}

            <div className={cn("group max-w-[85%] sm:max-w-[75%]")}>
              <div
                className={cn(
                  "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  message.role === "user"
                    ? "rounded-tr-sm bg-primary text-white"
                    : "rounded-tl-sm bg-[#fbfcfe] text-primary/85",
                )}
              >
                {message.content}
              </div>
              {message.role === "assistant" ? (
                <div className="mt-1.5 flex items-center gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => handleCopy(message.content)}
                    aria-label="Жауапты көшіру"
                    className="inline-flex size-7 items-center justify-center rounded-full text-muted hover:bg-primary/5 hover:text-primary"
                  >
                    <Copy className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    aria-label="Жауапты сақтау"
                    className="inline-flex size-7 items-center justify-center rounded-full text-muted hover:bg-primary/5 hover:text-primary"
                  >
                    <Bookmark className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRegenerate(message.id)}
                    aria-label="Қайта жасау"
                    className="inline-flex size-7 items-center justify-center rounded-full text-muted hover:bg-primary/5 hover:text-primary"
                  >
                    <RotateCcw className="size-3.5" />
                  </button>
                </div>
              ) : null}
            </div>

            {message.role === "user" ? (
              <span className="mt-1 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary/60">
                <User className="size-3.5" />
              </span>
            ) : null}
          </div>
        ))}

        {isTyping ? (
          <div className="flex items-center gap-2">
            <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-cyan/15 text-[#0b7ea8]">
              <Bot className="size-3.5" />
            </span>
            <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-[#fbfcfe] px-4 py-3">
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  className="size-1.5 rounded-full bg-primary/30"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: dot * 0.2 }}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {quickPrompts.length ? (
        <div className="flex gap-2 overflow-x-auto border-t border-primary/8 px-4 py-3 sm:px-6">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => sendMessage(prompt)}
              disabled={isTyping}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-primary/10 bg-[#fbfcfe] px-3.5 py-2 text-xs font-medium text-primary/75 transition-colors hover:border-cyan/30 hover:text-primary disabled:opacity-50"
            >
              <Sparkles className="size-3.5 text-violet" />
              {prompt}
            </button>
          ))}
        </div>
      ) : null}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="flex items-center gap-2 border-t border-primary/8 p-3.5 sm:p-4"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Сұрағыңызды жазыңыз..."
          aria-label="Хабарлама жазу"
          className="h-11 flex-1 rounded-full border border-primary/10 bg-[#fbfcfe] px-4 text-sm text-primary outline-none placeholder:text-muted focus:border-cyan/40 focus:ring-2 focus:ring-cyan/15"
        />
        <Button
          type="submit"
          size="icon"
          variant="gradient"
          disabled={!input.trim() || isTyping}
          aria-label="Жіберу"
          className="rounded-full"
        >
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
}

export { AiChat };
