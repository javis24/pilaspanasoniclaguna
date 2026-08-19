import { NextResponse } from "next/server";

import {
  getAIClient,
  getAIModel,
  getAIProvider,
} from "@/app/lib/ai";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const SYSTEM_PROMPT = `
Eres el asistente virtual de Pilas Panasonic Laguna.

Tu trabajo es ayudar a los clientes a identificar qué tipo de pila necesitan.

Reglas:
- Responde siempre en español.
- Sé amable, claro y breve.
- Haz una pregunta a la vez.
- Si el cliente menciona un control remoto, pregunta si utiliza pilas AA o AAA.
- Recomienda verificar el compartimiento del dispositivo.
- No inventes productos, precios, descuentos ni existencias.
- Todavía no tienes acceso al catálogo de productos.
- Si el usuario pregunta por un producto específico, explica que primero necesitas conocer el tamaño o modelo de la pila.
- No solicites datos bancarios.
`;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function errorResponse(message: string, status: number) {
  return NextResponse.json(
    {
      ok: false,
      message,
    },
    { status }
  );
}

export async function POST(request: Request) {
  try {
    const contentLength = Number(
      request.headers.get("content-length") || 0
    );

    if (contentLength > 25_000) {
      return errorResponse("La conversación es demasiado grande", 413);
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return errorResponse("El contenido JSON no es válido", 400);
    }

    if (!isRecord(body) || !Array.isArray(body.messages)) {
      return errorResponse(
        "Debes enviar una lista de mensajes",
        400
      );
    }

    if (
      body.messages.length === 0 ||
      body.messages.length > 20
    ) {
      return errorResponse(
        "La conversación debe contener entre 1 y 20 mensajes",
        400
      );
    }

    const normalizedMessages: ChatMessage[] = [];

    for (const message of body.messages) {
      if (
        !isRecord(message) ||
        (message.role !== "user" &&
          message.role !== "assistant") ||
        typeof message.content !== "string"
      ) {
        return errorResponse(
          "Uno o más mensajes no son válidos",
          400
        );
      }

      const content = message.content.trim();

      if (!content || content.length > 500) {
        return errorResponse(
          "Cada mensaje debe contener entre 1 y 500 caracteres",
          400
        );
      }

      normalizedMessages.push({
        role: message.role,
        content,
      });
    }

    const messages = normalizedMessages.slice(-10);

    if (messages.at(-1)?.role !== "user") {
      return errorResponse(
        "El último mensaje debe ser del usuario",
        400
      );
    }

    const client = getAIClient();
    const model = getAIModel();

    const completion = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system" as const,
          content: SYSTEM_PROMPT,
        },
        ...messages,
      ],
      temperature: 0.2,
      max_tokens: 300,
    });

    const assistantMessage =
      completion.choices[0]?.message?.content?.trim();

    if (!assistantMessage) {
      return errorResponse(
        "La IA no generó una respuesta",
        502
      );
    }

    return NextResponse.json({
      ok: true,
      message: assistantMessage,
      provider: getAIProvider(),
      model,
    });
  } catch (error) {
    console.error("Error en el chatbot:", error);

    return errorResponse(
      "No fue posible comunicarse con el asistente",
      502
    );
  }
}