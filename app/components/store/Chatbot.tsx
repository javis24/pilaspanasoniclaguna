"use client";

import {
  BatteryCharging,
  LoaderCircle,
  MessageCircle,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

const initialMessages: ChatMessage[] = [
  {
    id: "welcome-message",
    role: "assistant",
    content:
      "¡Hola! Soy tu asistente Panasonic. Puedo ayudarte a encontrar las pilas adecuadas para tu dispositivo.",
  },
];

const quickQuestions = [
  "Necesito pilas para un control remoto",
  "Busco pilas para juguetes",
  "Quiero pilas recargables",
];

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function createMessageId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] =
    useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(
    null
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  async function sendMessage(text: string) {
    const cleanMessage = text.trim();

    if (!cleanMessage || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: "user",
      content: cleanMessage,
    };

    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages
            .slice(-10)
            .map((chatMessage) => ({
              role: chatMessage.role,
              content: chatMessage.content,
            })),
        }),
      });

      const data: unknown = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        const errorMessage =
          isRecord(data) &&
          typeof data.message === "string"
            ? data.message
            : "No fue posible comunicarse con el asistente";

        throw new Error(errorMessage);
      }

      if (
        !isRecord(data) ||
        data.ok !== true ||
        typeof data.message !== "string"
      ) {
        throw new Error(
          "La respuesta del asistente no es válida"
        );
      }

      const assistantMessage: ChatMessage = {
        id: createMessageId(),
        role: "assistant",
        content: data.message,
      };

      setMessages((currentMessages) => [
        ...currentMessages,
        assistantMessage,
      ]);
    } catch (requestError) {
      const errorMessage =
        requestError instanceof Error
          ? requestError.message
          : "Ocurrió un error al enviar el mensaje";

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    void sendMessage(message);
  }

  function clearConversation() {
    setMessages(initialMessages);
    setMessage("");
    setError("");
  }

  return (
    <>
      {isOpen && (
        <section
          role="dialog"
          aria-label="Asistente de productos Panasonic"
          className="fixed inset-x-4 bottom-24 z-50 flex h-[min(72vh,580px)] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl sm:left-auto sm:right-6 sm:w-[390px]"
        >
          <header className="flex items-center justify-between bg-blue-700 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
                <BatteryCharging size={24} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-black">
                    Asistente Panasonic
                  </h2>

                  <Sparkles
                    size={16}
                    className="text-yellow-300"
                  />
                </div>

                <p className="flex items-center gap-2 text-xs text-blue-100">
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  Asistente con IA
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar chatbot"
              className="rounded-full p-2 transition hover:bg-white/15"
            >
              <X size={22} />
            </button>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">
            {messages.map((chatMessage) => (
              <div
                key={chatMessage.id}
                className={`flex ${
                  chatMessage.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    chatMessage.role === "user"
                      ? "rounded-br-md bg-blue-700 text-white"
                      : "rounded-bl-md border border-slate-200 bg-white text-slate-700 shadow-sm"
                  }`}
                >
                  {chatMessage.content}
                </div>
              </div>
            ))}

            {messages.length === 1 && !isLoading && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500">
                  Puedes preguntarme:
                </p>

                {quickQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() =>
                      void sendMessage(question)
                    }
                    className="block w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-left text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
                  <LoaderCircle
                    size={17}
                    className="animate-spin text-blue-700"
                  />
                  Pensando...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {error && (
            <div
              role="alert"
              className="border-t border-red-100 bg-red-50 px-4 py-2 text-xs font-medium text-red-700"
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-slate-200 bg-white p-4"
          >
            <input
              type="text"
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              placeholder="¿Para qué dispositivo necesitas pilas?"
              maxLength={500}
              disabled={isLoading}
              className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
            />

            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              aria-label="Enviar mensaje"
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-700 text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isLoading ? (
                <LoaderCircle
                  size={19}
                  className="animate-spin"
                />
              ) : (
                <Send size={19} />
              )}
            </button>
          </form>

          <div className="flex items-center justify-between bg-white px-4 pb-3">
            <button
              type="button"
              onClick={clearConversation}
              disabled={isLoading}
              className="text-[11px] font-semibold text-slate-500 hover:text-blue-700 disabled:cursor-not-allowed"
            >
              Limpiar conversación
            </button>

            <p className="text-[10px] text-slate-400">
              Verifica el tamaño antes de comprar
            </p>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() =>
          setIsOpen((currentValue) => !currentValue)
        }
        aria-label={
          isOpen
            ? "Cerrar asistente"
            : "Abrir asistente"
        }
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-blue-700 text-white shadow-xl transition hover:scale-105 hover:bg-blue-800"
      >
        {isOpen ? (
          <X size={28} />
        ) : (
          <MessageCircle size={28} />
        )}
      </button>
    </>
  );
}