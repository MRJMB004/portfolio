import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiMessageCircle, FiX, FiSend } from "react-icons/fi";
import {
  useSettings,
  useProjects,
  useSkillCategories,
  useExperience,
  useServices,
} from "../../hooks/useContent";
import { buildPortfolioContext } from "../../lib/chatContext";

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <span className="h-1.5 w-1.5 rounded-full bg-ink-muted/70 animate-bounce [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 rounded-full bg-ink-muted/70 animate-bounce [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 rounded-full bg-ink-muted/70 animate-bounce" />
    </div>
  );
}

export default function ChatWidget() {
  const { t, i18n } = useTranslation();
  const { data: settings } = useSettings();
  const { data: projects } = useProjects();
  const { data: skillCategories } = useSkillCategories();
  const { data: experience } = useExperience();
  const { data: services } = useServices();

  const fullName = settings?.site_name || "Jean Michel Bazire";

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  // Message d'accueil, une seule fois à l'ouverture
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "bot", text: t("chatbot.greeting", { name: fullName }) }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextMessages = [...messages, { role: "user", text: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const context = buildPortfolioContext({
        settings,
        projects,
        skillCategories,
        experience,
        services,
      });

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.slice(-12),
          context,
          lang: i18n.language?.startsWith("en") ? "en" : "fr",
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || "");
      }

      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch (err) {
      setError(err.message || t("chatbot.error"));
    } finally {
      setLoading(false);
    }
  }

  const quickQuestions = t("chatbot.quickQuestions", { returnObjects: true }) || [];
  const showQuickQuestions = messages.length <= 1 && !loading;

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t("chatbot.closeLabel") : t("chatbot.openLabel")}
        className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-gradient-brand shadow-glow transition-transform duration-300 hover:scale-110 active:scale-95"
      >
        {open ? <FiX size={22} /> : <FiMessageCircle size={22} />}
      </button>

      {/* Panneau de discussion */}
      {open && (
        <div className="fixed bottom-24 right-4 left-4 sm:left-auto sm:right-6 z-50 sm:w-96 h-[70vh] max-h-[600px] rounded-2xl border border-white/10 bg-bg-soft shadow-glow flex flex-col overflow-hidden animate-fade-in">
          {/* En-tête */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-white/5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-brand">
              <FiMessageCircle size={16} />
            </span>
            <div className="min-w-0">
              <p className="font-display font-semibold text-sm truncate">{t("chatbot.title")}</p>
              <p className="text-xs text-ink-muted truncate">{t("chatbot.subtitle", { name: fullName })}</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-gradient-brand text-white rounded-br-sm"
                      : "bg-white/5 border border-white/10 text-ink-muted rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm border border-white/10 bg-white/5">
                  <TypingDots />
                </div>
              </div>
            )}

            {error && (
              <p className="text-xs text-red-400 text-center px-2">{error}</p>
            )}

            {showQuickQuestions && (
              <div className="flex flex-wrap gap-2 pt-2">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-ink-muted hover:text-white hover:border-accent-violet/60 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Saisie */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex items-center gap-2 border-t border-white/10 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("chatbot.placeholder")}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-accent-violet/60 transition-colors placeholder:text-ink-muted"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label={t("chatbot.send")}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-brand disabled:opacity-40 transition-opacity"
            >
              <FiSend size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
