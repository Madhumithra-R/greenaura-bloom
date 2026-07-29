import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Send, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "@/hooks/use-toast";

type Msg = { role: "user" | "assistant"; content: string };

const ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/plant-assistant`;

const suggestions = [
  "A plant for a dark bedroom?",
  "Which plants are pet friendly?",
  "Why are my leaves yellowing?",
];

const PlantAssistant = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: "Hi! I'm your GreenAura plant concierge 🌿 Tell me about your space and I'll suggest the right plant.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: next.slice(-20) }),
      });

      if (!res.ok || !res.body) {
        const detail = await res.text().catch(() => "");
        throw new Error(
          res.status === 429
            ? "Too many requests — please try again in a moment."
            : res.status === 402
              ? "AI credits are exhausted for this workspace."
              : detail || "The assistant is unavailable right now.",
        );
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: acc }]);
      }
    } catch (err) {
      setMessages(next);
      toast({
        title: "Assistant error",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close plant assistant" : "Open plant assistant"}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-110"
      >
        {open ? <X size={22} /> : <Leaf size={22} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="fixed bottom-24 right-6 z-50 flex h-[30rem] w-[min(24rem,calc(100vw-3rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            <header className="bg-primary px-5 py-4 text-primary-foreground">
              <p className="font-heading text-lg font-semibold">Plant Concierge</p>
              <p className="text-xs text-primary-foreground/70">AI advice from our live catalog</p>
            </header>

            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {m.role === "assistant" ? (
                    <div className="space-y-2 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_strong]:font-semibold">
                      <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
                    </div>
                  ) : (
                    m.content
                  )}
                </div>
              ))}

              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-border p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={500}
                placeholder="Ask about light, watering, pets…"
                aria-label="Message the plant concierge"
                className="flex-1 rounded-full bg-muted px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send message"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default PlantAssistant;
