import { useState } from "react";
import { uJeanMichelnslation } from "react-i18next";
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheck, FiAlertCircle } from "react-icons/fi";
import Reveal from "../Reveal";
import { supabase, isSupabaseConfigured } from "../../lib/supabaseClient";
import { useSettings } from "../../hooks/useContent";

const initialForm = { name: "", email: "", subject: "", message: "", company: "" };

export default function Contact() {
  const { t } = uJeanMichelnslation();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const { data: settings } = useSettings();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    // Honeypot anti-spam : si rempli, on fait semblant que tout s'est bien passé
    if (form.company) {
      setStatus("sent");
      setForm(initialForm);
      return;
    }

    try {
      // 1) Notification e-mail via la fonction serverless existante (Resend)
      const emailPromise = fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      // 2) Enregistrement en base pour consultation depuis /admin/messages
      const dbPromise = isSupabaseConfigured
        ? supabase.from("messages").insert({
            name: form.name,
            email: form.email,
            subject: form.subject,
            message: form.message,
          })
        : Promise.resolve({ error: null });

      const [emailRes, { error: dbError }] = await Promise.all([emailPromise, dbPromise]);

      // On considère l'envoi réussi si au moins un des deux canaux fonctionne.
      if (!emailRes.ok && dbError) throw new Error("both channels failed");

      setStatus("sent");
      setForm(initialForm);
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
    }
  };

  const infos = [
    {
      icon: FiMail,
      label: settings?.contact_email || "contact@JeanMichel.dev",
      href: `mailto:${settings?.contact_email || "contact@JeanMichel.dev"}`,
    },
    {
      icon: FiPhone,
      label: settings?.contact_phone || "+261 34 00 000 00",
      href: `tel:${(settings?.contact_phone || "+261340000000").replace(/\s/g, "")}`,
    },
    { icon: FiMapPin, label: settings?.location || "Madagascar", href: "#" },
  ];

  return (
    <section id="contact" className="section-pad bg-bg-soft/30">
      <Reveal>
        <p className="eyebrow mb-4">{t("contact.eyebrow")}</p>
        <h3 className="font-display text-3xl font-bold mb-4">{t("contact.title")}</h3>
        <p className="text-ink-muted mb-12 max-w-lg">{t("contact.subtitle")}</p>
      </Reveal>

      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10">
        <Reveal>
          <div className="space-y-4">
            {infos.map((info) => (
              <a
                key={info.label}
                href={info.href}
                className="card flex items-center gap-4 px-5 py-4 transition-all duration-300 hover:border-accent-violet/40 hover:translate-x-1"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-brand">
                  <info.icon size={16} />
                </span>
                {info.label}
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <form onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-4">
            {/* Honeypot anti-spam — champ invisible, doit rester vide */}
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <input
                required
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder={t("contact.form.name")}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent-violet/60 transition-colors placeholder:text-ink-muted"
              />
              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder={t("contact.form.email")}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent-violet/60 transition-colors placeholder:text-ink-muted"
              />
            </div>
            <input
              required
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder={t("contact.form.subject")}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent-violet/60 transition-colors placeholder:text-ink-muted"
            />
            <textarea
              required
              rows={5}
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder={t("contact.form.message")}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent-violet/60 transition-colors resize-none placeholder:text-ink-muted"
            />

            <button
              type="submit"
              disabled={status === "sending"}
              className="btn-primary w-full justify-center disabled:opacity-60"
            >
              {status === "sending" && t("contact.form.sending")}
              {status === "sent" && (
                <>
                  {t("contact.form.sent")} <FiCheck />
                </>
              )}
              {(status === "idle" || status === "error") && (
                <>
                  {t("contact.form.submit")} <FiSend />
                </>
              )}
            </button>

            {status === "error" && (
              <p className="flex items-center gap-2 text-sm text-red-400">
                <FiAlertCircle /> {t("contact.form.error")}
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
