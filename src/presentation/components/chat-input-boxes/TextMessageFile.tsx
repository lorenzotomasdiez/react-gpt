import { FormEvent, useRef, useState } from "react";

interface Props {
  onSendMessage: (msg: string, audioFile: File) => void;
  placeholder?: string;
  disableCorrections?: boolean;
  accept?: string;
}

export const TextMessageFile = ({ onSendMessage, placeholder, disableCorrections = false, accept }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (message.trim() === "") return;
    if (selectedFile === null) return;
    onSendMessage(message, selectedFile!);
    setMessage('');
    setSelectedFile(null);
  }
  return (
    <form
      className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4"
      onSubmit={handleSendMessage}
    >
      <div className="mr-3">
        <button
          type="button"
          className="flex items-center justify-center text-gray-400 hover:text-gray-600"
          onClick={() => inputRef.current?.click()}
        >
          <i className="fa-solid fa-paperclip text-xl"></i>
        </button>
        <input
          type="file"
          className="hidden"
          ref={inputRef}
          accept={accept}
          onChange={(e) => setSelectedFile(e.target.files?.item(0) || null)}
        />
      </div>
      <div className="flex-grow">
        <div className="relative w-full">
          <input
            className="flex w-full border rounded-xl text-gray-800 focus:outline-none focus:border-indigo-300 pl-4 h-10"
            type="text"
            autoFocus
            name="message"
            placeholder={placeholder}
            autoCorrect={disableCorrections ? "on" : "off"}
            autoComplete={disableCorrections ? "on" : "off"}
            spellCheck={disableCorrections ? true : false}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </div>
      <div className="ml-4">
        <button
          className="btn-primary"
          disabled={!selectedFile}
        >
          {
            (!selectedFile) ? (
              <span className="mr-2">Enviar</span>
            ) : (
              <span className="mr-2">{selectedFile.name.substring(0, 15) + '...'}</span>
            )
          }
          <i className="fa-regular fa-paper-plane"></i>
        </button>
      </div>
    </form>
  )
}
