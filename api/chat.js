// Vercel Serverless Function — /api/chat
//
// Fait le lien entre le chatbot du portfolio et l'API Gemini (Google AI Studio,
// gratuite). Le client envoie l'historique de la conversation + un résumé
// texte du portfolio (voir src/lib/chatContext.js) ; cette fonction relaie la
// requête à Gemini avec des instructions strictes pour qu'il ne réponde qu'à
// propos du propriétaire du portfolio.
//
// Configuration (Vercel → Project Settings → Environment Variables) :
//   GEMINI_API_KEY   clé API Gemini (https://aistudio.google.com/apikey) — gratuit
//
// La clé n'est JAMAIS envoyée au navigateur : elle reste côté serveur.

const MODEL = "gemini-2.5-flash";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[chat] GEMINI_API_KEY manquante dans les variables d'environnement Vercel.");
    return res.status(500).json({ error: "Chatbot non configuré (clé API manquante)." });
  }

  const { messages, context, lang } = req.body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Aucun message fourni." });
  }
  // Garde-fous simples anti-abus (coût/quota Gemini)
  if (messages.length > 20) {
    return res.status(400).json({ error: "Conversation trop longue, recharge la page." });
  }
  const invalid = messages.some((m) => typeof m?.text !== "string" || m.text.length > 1500);
  if (invalid) {
    return res.status(400).json({ error: "Message invalide ou trop long." });
  }
  if (typeof context === "string" && context.length > 6000) {
    return res.status(400).json({ error: "Contexte invalide." });
  }

  const langLabel = lang === "en" ? "anglais" : "français";

  const systemInstruction = {
    parts: [
      {
        text:
          "Tu es l'assistant virtuel officiel du portfolio décrit ci-dessous. Tu réponds UNIQUEMENT aux " +
          "questions concernant le propriétaire de ce portfolio (son parcours, ses compétences, ses projets, " +
          "comment le contacter, sa disponibilité, etc), en te basant strictement sur les informations fournies. " +
          "Si une question sort de ce cadre (actualité, culture générale, autre sujet, demande de coder quelque " +
          "chose, etc), réponds poliment que tu ne peux répondre qu'aux questions sur ce portfolio. " +
          `Réponds toujours en ${langLabel}, sur un ton chaleureux et naturel, en 2 à 4 phrases maximum, sans ` +
          "listes à puces sauf si on te demande explicitement une liste (par exemple la liste des projets). " +
          "N'invente jamais une information qui n'est pas dans le contexte ci-dessous ; si tu ne sais pas, " +
          "propose de contacter directement le propriétaire par e-mail.\n\n" +
          `--- Informations sur le propriétaire du portfolio ---\n${context || "(aucune information fournie)"}`,
      },
    ],
  };

  const contents = messages.map((m) => ({
    role: m.role === "bot" ? "model" : "user",
    parts: [{ text: m.text }],
  }));

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction,
          contents,
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 300,
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const detail = await geminiRes.text();
      console.error("[chat] Échec Gemini:", geminiRes.status, detail);
      return res.status(502).json({ error: "Le chatbot est momentanément indisponible, réessaie bientôt." });
    }

    const data = await geminiRes.json();
    const reply = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("").trim();

    if (!reply) {
      return res.status(200).json({
        reply: "Désolé, je n'ai pas pu générer de réponse claire. Peux-tu reformuler ta question ?",
      });
    }

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("[chat] Erreur serveur:", err);
    return res.status(500).json({ error: "Erreur serveur, réessaie plus tard." });
  }
}
