import { useRef, useState } from "react"
import { GPTMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components"
import { prosConsStreamGeneratorUseCase } from "../../../core";

interface Message {
  text: string;
  isGPT: boolean;
}

export const ProsConsStreamPage = () => {
  const abortController = useRef(new AbortController());
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const isRunning = useRef(false);

  const handlePost = async (txt: string) => {
    if (isRunning.current) {
      abortController.current.abort();
      abortController.current = new AbortController();
    };
    setLoading(true);
    isRunning.current = true;
    setMessages(prev => [...prev, { text: txt, isGPT: false }]);
    const stream = prosConsStreamGeneratorUseCase(txt, abortController.current.signal);
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
      <TextMessageBox
        placeholder="Escribe tu texto aquí..."
        onSendMessage={handlePost}
      />
    </div>
  )
}


// const handlePostOld = async (txt: string) => {
//   setLoading(true);
//   setMessages(prev => [...prev, { text: txt, isGPT: false }]);
//   const reader = await prosConsStreamUseCase(txt);
//   setLoading(false);
//   if (!reader) return;
//   const decoder = new TextDecoder('utf-8');
//   let message = '';
//   setMessages((messages) => [...messages, { text: message, isGPT: true }]);
//   while (true) {
//     const { done, value } = await reader.read();
//     if (done) {
//       break;
//     }
//     message += decoder.decode(value, { stream: true });
//     setMessages((messages) => {
//       const newMessages = [...messages];
//       newMessages[newMessages.length - 1].text = message;
//       return newMessages;
//     });
//   }
// }