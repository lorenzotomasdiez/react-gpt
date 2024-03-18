import { useState } from "react"
import { GPTMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components"
import { prosConsUseCase } from "../../../core";

interface Message {
  text: string;
  isGPT: boolean;
}

export const ProsConsPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const handlePost = async (txt: string) => {
    setLoading(true);
    setMessages(prev => [...prev, { text: txt, isGPT: false }]);
    const res = await prosConsUseCase(txt);
    if (!res.ok) {
      setMessages(prev => [...prev, { text: res.content, isGPT: true }]);
    }
    setMessages(prev => [...prev, {
      text: res.content, isGPT: true
    }]);

    setLoading(false);
  }
  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* BIENVENIDA */}
          <GPTMessage text="Hola puedes pregunta sobre pros y contras" />
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
      <TextMessageBox
        placeholder="Escribe tu texto aquí..."
        onSendMessage={handlePost}
      />
    </div>
  )
}
