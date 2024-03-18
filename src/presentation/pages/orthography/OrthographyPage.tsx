import { useState } from "react"
import { GPTMessage, GPTOrthographyMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components"
import { orthographyUseCase } from "../../../core";

interface Message {
  text: string;
  isGPT: boolean;
  info?: {
    userScore: number;
    errors: string[];
    message: string;
  }
}

export const OrthographyPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const handlePost = async (txt: string) => {
    setLoading(true);
    setMessages(prev => [...prev, { text: txt, isGPT: false }]);
    const res = await orthographyUseCase(txt);
    if (!res.ok) {
      setMessages(prev => [...prev, { text: res.message, isGPT: true }]);
    }
    setMessages(prev => [...prev, {
      text: res.message, isGPT: true, info: {
        userScore: res.userScore,
        errors: res.errors,
        message: res.message
      }
    }]);

    setLoading(false);
  }
  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* BIENVENIDA */}
          <GPTMessage text="Hola puedes escribir tu texto en espa;ol" />
          {
            messages.map((message, index) => (
              message.isGPT
                ?
                <GPTOrthographyMessage
                  userScore={message.info!.userScore}
                  errors={message.info!.errors}
                  message={message.info!.message}
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
