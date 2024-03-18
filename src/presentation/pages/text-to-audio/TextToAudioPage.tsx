import { useState } from "react"
import { GPTMessage, GPTMessageAudio, MyMessage, TextMessageBoxSelect, TypingLoader } from "../../components"
import { textToAudioUseCase } from "../../../core";

interface TextMessage {
  text: string;
  isGPT: boolean;
  type: 'text';
}

interface AudioMessage {
  type: 'audio'
  audio: string;
  text: string;
  isGPT: boolean;
}

type Message = TextMessage | AudioMessage;

const voices = [
  { id: "nova", text: "Nova" },
  { id: "alloy", text: "Alloy" },
  { id: "echo", text: "Echo" },
  { id: "fable", text: "Fable" },
  { id: "onyx", text: "Onyx" },
  { id: "shimmer", text: "Shimmer" },
]

export const TextToAudioPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (txt: string, voice: string) => {
    setLoading(true);
    setMessages(prev => [...prev, { text: txt, isGPT: false, type: "text" }]);
    const { ok, message, audioUrl } = await textToAudioUseCase(txt, voice);
    setLoading(false);
    if (!ok) return;
    setMessages(prev => [...prev, { text: message, audio: audioUrl!, isGPT: true, type: "audio" }]);
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* BIENVENIDA */}
          <GPTMessage text="Que audio quieres generar hoy?" />
          {
            messages.map((message, index) => (
              message.isGPT ? (
                message.type === "audio" ? (
                  <GPTMessageAudio
                    text={message.text}
                    key={index}
                    audio={message.audio}
                  />
                ) : (
                  <GPTMessage
                    text={message.text}
                    key={index}
                  />
                )
              )
                : <MyMessage text={message.text} key={index} />
            ))
          }
          {
            loading && <TypingLoader className="fade-in" />
          }
        </div>
      </div>
      <TextMessageBoxSelect
        placeholder="Escribe tu texto para generar un audio..."
        onSendMessage={handlePost}
        options={voices}
      />
    </div>
  )
}