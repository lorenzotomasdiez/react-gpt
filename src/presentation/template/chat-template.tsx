import { useState } from "react"
import { GPTMessage, MyMessage, TextMessageBox, TypingLoader } from "../components"

interface Message {
  text: string;
  isGPT: boolean;
}

export const ChatTemplate = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const handlePost = async (txt: string) => {
    setLoading(true);
    setMessages(prev => [...prev, { text: txt, isGPT: false }]);
    setLoading(false);
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
                ? <GPTMessage text={message.text} key={index} />
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

