import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([
    { sender: "assistant", message_content: "Hi 👋 How can I help you today?" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState([]); // [{id: 1, title: "..."}]
  const [activeChat, setActiveChat] = useState(null);
  const [isNewChat, setIsNewChat] = useState(true);

  return (
    <ChatContext.Provider value={{
        messages,
        setMessages,
        isLoading,
        setIsLoading,
        chats,
        setChats,
        activeChat,
        setActiveChat,
        isNewChat,
        setIsNewChat
      }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}
