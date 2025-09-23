import React, { useState } from "react"
import { Send, Bot, User, Minimize2 } from "lucide-react"

export const AIChatbot = ({ isMinimized, onToggleMinimize }) => {
  const [messages, setMessages] = useState([
    {
      id: "1",
      content:
        "Hi! I'm your AI email assistant. I can help you write, improve, or respond to emails. What would you like to do?",
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState("")

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(inputMessage),
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  const getAIResponse = input => {
    const lowerInput = input.toLowerCase()

    if (lowerInput.includes("write") || lowerInput.includes("compose")) {
      return "I'd be happy to help you write an email! Please tell me:\n\n1. Who is the recipient?\n2. What's the purpose of the email?\n3. What tone would you like (formal, casual, friendly)?\n\nI'll draft something for you to review and edit."
    } else if (lowerInput.includes("reply") || lowerInput.includes("respond")) {
      return "I can help you craft a thoughtful reply! Share the email you're responding to or tell me the key points you want to address, and I'll suggest a response."
    } else if (lowerInput.includes("improve") || lowerInput.includes("edit")) {
      return "I'll help you polish your email! Paste your draft and I'll suggest improvements for clarity, tone, and professionalism."
    } else if (
      lowerInput.includes("meeting") ||
      lowerInput.includes("schedule")
    ) {
      return "I can help you write a meeting request email. I'll need:\n\n• Meeting purpose\n• Preferred dates/times\n• Duration\n• Attendees\n• Meeting location (in-person/virtual)\n\nShall we start with the meeting purpose?"
    } else {
      return "I understand you need help with email-related tasks. I can:\n\n✉️ Write new emails\n📝 Improve existing drafts\n↩️ Suggest replies\n📅 Schedule meetings\n🎯 Adjust tone and style\n\nWhat would you like to work on?"
    }
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={onToggleMinimize}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors duration-200"
        >
          <Bot size={24} />
        </button>
      </div>
    )
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="text-blue-600" size={20} />
          <h3 className="font-semibold text-gray-900">AI Assistant</h3>
        </div>
        <button
          onClick={onToggleMinimize}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <Minimize2 size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.isUser ? "justify-end" : "justify-start"
            }`}
          >
            {!message.isUser && (
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot size={16} className="text-blue-600" />
              </div>
            )}

            <div
              className={`max-w-[250px] rounded-lg px-3 py-2 ${
                message.isUser
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>

            {message.isUser && (
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-gray-600" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            onKeyPress={e => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask me anything about emails..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
