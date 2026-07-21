// Vercel Serverless Function — /api/contact
//
// Reçoit les soumissions du formulaire de contact, les valide, puis :
//   1. envoie un e-mail de notification (via Resend, si RESEND_API_KEY est configuré)
//   2. répond au client — le message contient "replyTo" pour pouvoir répondre plus tard
//      directement depuis ta boîte mail.
//
// Configuration (Vercel → Project Settings → Environment Variables) :
//   RESEND_API_KEY   clé API Resend (https://resend.com) — gratuit pour un usage perso
//   CONTACT_TO_EMAIL adresse qui doit recevoir les notifications
//   CONTACT_FROM     adresse d'expédition vérifiée dans Resend (ex: "Portfolio <onboarding@resend.dev>")
//
// Si RESEND_API_KEY n'est pas défini, la fonction valide et journalise simplement
// le message (visible dans les logs Vercel) sans échouer — pratique en développement.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const { name, email, subject, message, company } = req.body || {};

  // Honeypot anti-spam : champ caché côté formulaire, doit rester vide
  if (company) {
    return res.status(200).json({ ok: true });
  }

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Adresse e-mail invalide." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>";

  if (!apiKey || !to) {
    console.log("[contact] Nouveau message (notification e-mail non configurée) :", {
      name,
      email,
      subject,
      message,
    });
    return res.status(200).json({ ok: true, mailed: false });
  }

  try {
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: email,
        subject: `[Portfolio] ${subject}`,
        text: `Nouveau message depuis le portfolio\n\nNom: ${name}\nEmail: ${email}\n\n${message}`,
      }),
    });

    if (!emailRes.ok) {
      const detail = await emailRes.text();
      console.error("[contact] Échec envoi Resend:", detail);
      return res.status(502).json({ error: "Échec de l'envoi de la notification." });
    }

    return res.status(200).json({ ok: true, mailed: true });
  } catch (err) {
    console.error("[contact] Erreur serveur:", err);
    return res.status(500).json({ error: "Erreur serveur, réessaie plus tard." });
  }
}
