import { useState } from "react"
import { GPTMessage, GPTMessageImage, MyMessage, TextMessageBox, TypingLoader } from "../../components"
import { imageGenerationUseCase } from "../../../core";

interface Message {
  text: string;
  isGPT: boolean;
  info?: {
    url: string;
    alt: string;
  }
}

export const ImageGenerationPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const handlePost = async (txt: string) => {
    setLoading(true);
    setMessages(prev => [...prev, { text: txt, isGPT: false }]);
    const imageInfo = await imageGenerationUseCase(txt);
    setLoading(false);

    if (!imageInfo) {
      setMessages(prev => [...prev, { text: "No se pudo generar la imagen", isGPT: true }]);
      return;
    }

    setMessages(prev => [...prev, { text: "Aqui tienes tu imagen", isGPT: true, info: imageInfo }]);
  }
  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* BIENVENIDA */}
          <GPTMessage text="Que imagen quieres generar hoy?" />
          {
            messages.map((message, index) => (
              message.isGPT
                ? <GPTMessageImage text={message.text} key={index} alt={message.info!.url} url={message.info!.url} />
                : <MyMessage text={message.text} key={index} />
            ))
          }
          {
            loading && <TypingLoader className="fade-in" />
          }
        </div>
      </div>
      <TextMessageBox
        onSendMessage={handlePost}
        placeholder="Escribe tu mensaje..."
        disableCorrections
      />
    </div>
  )
}

