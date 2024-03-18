import { useRef, useState } from "react"
import { GPTMessage, MyMessage, TextMessageBoxSelect, TypingLoader } from "../../components"
import { translateStreamUseCase } from "../../../core";

interface Message {
  text: string;
  isGPT: boolean;
}

const languages = [
  { id: "alemán", text: "Alemán" },
  { id: "árabe", text: "Árabe" },
  { id: "bengalí", text: "Bengalí" },
  { id: "francés", text: "Francés" },
  { id: "hindi", text: "Hindi" },
  { id: "inglés", text: "Inglés" },
  { id: "japonés", text: "Japonés" },
  { id: "mandarín", text: "Mandarín" },
  { id: "portugués", text: "Portugués" },
  { id: "ruso", text: "Ruso" },
];

export const TranslatePage = () => {
  const abortController = useRef(new AbortController());
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const isRunning = useRef(false);

  const handlePost = async (txt: string, lang: string) => {
    if (isRunning.current) {
      abortController.current.abort();
      abortController.current = new AbortController();
    };
    setLoading(true);
    isRunning.current = true;
    setMessages(prev => [...prev, { text: txt, isGPT: false }]);
    const stream = translateStreamUseCase(txt, lang, abortController.current.signal);
    setLoading(false);
    setMessages(prev => [...prev, { text: '', isGPT: true }]);
    for await (const chunk of stream) {
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].text = chunk;
        return newMessages;
      })
    }
    isRunning.current = false;
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* BIENVENIDA */}
          <GPTMessage text="Hola puedes pregunta sobre pros y contras en stream" />
          {
            messages.map((message, index) => (
              message.isGPT
                ?
                <GPTMessage
                  text={message.text}
                  key={index}
                />
                : <MyMessage text={message.text} key={index} />
            ))
          }
          {
            loading && <TypingLoader className="fade-in" />
          }
        </div>
      </div>
      <TextMessageBoxSelect
        placeholder="Escribe tu texto a traducir aqui..."
        onSendMessage={handlePost}
        options={languages}
      />
    </div>
  )
}