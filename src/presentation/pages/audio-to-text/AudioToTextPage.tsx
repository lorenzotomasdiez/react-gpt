import { useState } from "react"
import { GPTMessage, GPTMessageAudio, MyMessage, TextMessageFile, TypingLoader } from "../../components"
import { audioToTextUseCase } from "../../../core";

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

export const AudioToTextPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (txt: string, audioFile: File) => {
    setLoading(true);
    setMessages(prev => [...prev, { text: txt, isGPT: false, type: "text" }]);
    const { ok, duration, text } = await audioToTextUseCase(txt, audioFile);
    if (!ok) {
      setLoading(false);
      return;
    };
    const gptMessage = `
      ## Transcription:
      __Duration:__ ${Math.round(duration)}
      ## El texto es ${text}
    `
    if (!ok) return;
    setMessages(prev => [...prev, { text: gptMessage, isGPT: true, type: "text" }]);
    setLoading(false);
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
      <TextMessageFile
        placeholder="alohaaa"
        disableCorrections
        onSendMessage={handlePost}
        accept="audio/*"
      />
    </div>
  )
}