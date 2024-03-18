import { FormEvent, useState } from "react";

interface Props {
  onSendMessage: (msg: string, option: string) => void;
  placeholder?: string;
  disableCorrections?: boolean;
  options: Option[];
}

interface Option {
  id: string;
  text: string;
}

export const TextMessageBoxSelect = ({ onSendMessage, placeholder, disableCorrections = false, options }: Props) => {
  const [message, setMessage] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (message.trim() === "") return;
    if (selectedOption == "") return;
    onSendMessage(message, selectedOption);
    setMessage('');
  }
  return (
    <form
      className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4"
      onSubmit={handleSendMessage}
    >
      <div className="flex-grow">
        <div className="flex">
          <input
            className="w-full border rounded-xl text-gray-800 focus:outline-none focus:border-indigo-300 pl-4 h-10"
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
          <select
            name="select"
            className="w-2/5 ml-5 border rounded-xl text-gray-800 focus:outline-none focus:border-indigo-300 pl-4 h-10"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="">Selecciona un idioma</option>
            {
              options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.text}
                </option>
              ))
            }
          </select>
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
