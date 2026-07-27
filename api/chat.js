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

// Liste de modèles à essayer, du plus récent/rapide au plus "de secours".
// Google retire régulièrement d'anciens modèles (ex: toute la génération 2.0
// a été coupée le 1er juin 2026), ce qui casse l'appel avec une erreur 404
// ("model not found") si on ne cible qu'un seul modèle en dur. Pour éviter
// que le chatbot tombe en panne à chaque retrait, on essaie les modèles dans
// l'ordre ci-dessous et on passe automatiquement au suivant en cas d'échec
// (404 = modèle retiré, 429 = quota gratuit épuisé pour ce modèle).
//
// Pour changer de modèle "principal" plus tard, il suffit de modifier cette
// liste — aucune autre partie du code à toucher.
const MODELS = [
  "gemini-3.5-flash-lite", // principal : rapide et quota gratuit généreux
  "gemini-3.1-flash-lite", // repli 1 : génération précédente, encore dispo
  "gemini-2.5-flash-lite", // repli 2 : ancienne génération, en dernier recours
];

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

  const body = JSON.stringify({
    systemInstruction,
    contents,
    generationConfig: {
      temperature: 0.6,
      // Budget généreux : le modèle utilise une partie de ces tokens
      // pour "réfléchir" en interne avant de répondre, donc on laisse
      // de la marge pour que la réponse visible ne soit jamais coupée.
      maxOutputTokens: 1024,
    },
  });

  // On essaie chaque modèle de la liste dans l'ordre, jusqu'à ce qu'un
  // appel réussisse. `lastStatus`/`lastDetail` gardent la trace du dernier
  // échec pour construire un message d'erreur pertinent si TOUS échouent.
  let lastStatus = null;
  let lastDetail = null;

  for (const model of MODELS) {
    try {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body,
        }
      );

      if (!geminiRes.ok) {
        const detail = await geminiRes.text();
        lastStatus = geminiRes.status;
        lastDetail = detail;
        console.error(`[chat] Échec Gemini (modèle "${model}"):`, geminiRes.status, detail);

        // 404 (modèle retiré/inconnu) ou 429 (quota épuisé pour ce modèle) :
        // on tente le modèle de secours suivant plutôt que d'abandonner.
        if (geminiRes.status === 404 || geminiRes.status === 429) {
          continue;
        }

        // Autre erreur (400, 500, etc.) : peu de chances qu'un autre modèle
        // s'en sorte mieux, mais on essaie quand même le suivant par
        // sécurité, sauf s'il ne reste plus de modèle dans la liste.
        continue;
      }

      const data = await geminiRes.json();
      const reply = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("").trim();

      if (model !== MODELS[0]) {
        console.warn(`[chat] Réponse obtenue via le modèle de secours "${model}".`);
      }

      if (!reply) {
        return res.status(200).json({
          reply: "Désolé, je n'ai pas pu générer de réponse claire. Peux-tu reformuler ta question ?",
        });
      }

      return res.status(200).json({ reply });
    } catch (err) {
      // Erreur réseau (pas une réponse HTTP d'erreur) : on note et on
      // passe au modèle suivant.
      lastStatus = lastStatus ?? "network_error";
      lastDetail = err?.message || String(err);
      console.error(`[chat] Erreur réseau avec le modèle "${model}":`, err);
    }
  }

  // Tous les modèles de la liste ont échoué.
  console.error("[chat] Tous les modèles ont échoué. Dernière erreur:", lastStatus, lastDetail);

  if (lastStatus === 429) {
    return res.status(429).json({
      error: "Trop de questions en peu de temps (limite du plan gratuit). Réessaie dans une minute.",
    });
  }

  return res.status(502).json({ error: "Le chatbot est momentanément indisponible, réessaie bientôt." });
}
