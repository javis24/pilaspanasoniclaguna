import "server-only";

import OpenAI from "openai";

let aiClient: OpenAI | null = null;

function getProvider() {
  return process.env.AI_PROVIDER?.trim().toLowerCase() || "groq";
}

export function getAIClient() {
  if (aiClient) {
    return aiClient;
  }

  const provider = getProvider();

  if (provider === "groq") {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      throw new Error("Falta configurar GROQ_API_KEY");
    }

    aiClient = new OpenAI({
      apiKey,
      baseURL: "https://api.groq.com/openai/v1",
    });

    return aiClient;
  }

  if (provider === "openai") {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error("Falta configurar OPENAI_API_KEY");
    }

    aiClient = new OpenAI({
      apiKey,
    });

    return aiClient;
  }

  throw new Error(`Proveedor de IA no soportado: ${provider}`);
}

export function getAIModel() {
  const provider = getProvider();

  if (process.env.AI_MODEL) {
    return process.env.AI_MODEL;
  }

return provider === "groq"
  ? "openai/gpt-oss-20b"
  : "gpt-5-nano";
}

export function getAIProvider() {
  return getProvider();
}