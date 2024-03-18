import { useState } from "react"
import { GPTMessage, GPTMessageImage, GPTSelectableImage, MyMessage, TextMessageBox, TypingLoader } from "../../components"
import { imageGenerationUseCase, imageVariationUseCase } from "../../../core";

interface Message {
  text: string;
  isGPT: boolean;
  info?: {
    url: string;
    alt: string;
  }
}

export const ImageTunningPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([{
    isGPT: true,
    text: "Base Img",
    info: {
      url: "http://localhost:3000/gpt/image-generation/1710536942355.png",
      alt: "Base Img"
    }
  }]);

  const [originalImageAndMask, setOriginalImageAndMask] = useState({
    original: undefined as string | undefined,
    mask: undefined as string | undefined,
  });

  const handleVariation = async () => {
    setLoading(true);
    const resp = await imageVariationUseCase(originalImageAndMask.original!);
    setLoading(false);

    if (!resp) return;

    setMessages(prev => [...prev, { text: "Aqui tienes tu variacion", isGPT: true, info: resp }]);
  }


  const handlePost = async (txt: string) => {
    setLoading(true);
    setMessages(prev => [...prev, { text: txt, isGPT: false }]);

    const { original, mask } = originalImageAndMask;

    const imageInfo = await imageGenerationUseCase(txt, original, mask);
    setLoading(false);

    if (!imageInfo) {
      setMessages(prev => [...prev, { text: "No se pudo generar la imagen", isGPT: true }]);
      return;
    }

    setMessages(prev => [...prev, { text: "Aqui tienes tu imagen", isGPT: true, info: imageInfo }]);
  }
  return (
    <>
      {
        originalImageAndMask.original && (
          <div className="fixed flex flex-col items-center top-10 right-10 z-10 fade-in">
            <span>Editando</span>
            <img
              src={originalImageAndMask.original}
              alt="Original"
              className="w-36 h-36 rounded-xl object-contain border"
            />
            <button
              className="btn-primary mt-2"
              onClick={handleVariation}
            >
              Generar variacion
            </button>
          </div>
        )
      }
      <div className="chat-container">
        <div className="chat-messages">
          <div className="grid grid-cols-12 gap-y-2">
            {/* BIENVENIDA */}
            <GPTMessage text="Que imagen quieres generar hoy?" />
            {
              messages.map((message, index) => (
                message.isGPT
                  ?
                  (
                    <GPTSelectableImage
                      text={message.text}
                      key={index}
                      alt={message.info!.url}
                      url={message.info!.url}
                      onClick={() => setOriginalImageAndMask({ original: message.info!.url, mask: undefined })}
                    />
                  )
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
    </>
  )
}

