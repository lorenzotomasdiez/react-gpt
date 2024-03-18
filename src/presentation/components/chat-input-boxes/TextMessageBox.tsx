import { FormEvent, useState } from "react";

interface Props {
  onSendMessage: (msg: string) => void;
  placeholder?: string;
  disableCorrections?: boolean;
}

export const TextMessageBox = ({ onSendMessage, placeholder, disableCorrections = false }: Props) => {
  const [message, setMessage] = useState<string>("");
  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (message.trim() === "") return;
    onSendMessage(message);
    setMessage('');
  }
  return (
    <form
      className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4"
      onSubmit={handleSendMessage}
    >
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
        >
          <span className="mr-2">Enviar</span>
          <i className="fa-regular fa-paper-plane"></i>
        </button>
      </div>
    </form>
  )
}
