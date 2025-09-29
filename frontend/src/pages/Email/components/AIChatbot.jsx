import React, { useState, useRef } from "react"
import { Send, Bot, User, Minimize2 } from "lucide-react"
import { useApi } from '../../../utils/api';
import { infinity } from 'ldrs'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
infinity.register()

export const AIChatbot = ({ isMinimized, onToggleMinimize, isUserLoggedIn }) => {
  const { makeRequest } = useApi();
  const [messages, setMessages] = useState([
    {
      id: "1",
      content:
        "Hi! I'm your AI email assistant. I can help you write, improve, or respond to emails. What would you like to do?",
      isUser: false,
      timestamp: new Date()
    }
  ])

  const [selectedTask, setSelectedTask] = useState("")
  const [userText, setUserText] = useState("")
  const [showPopover, setShowPopover] = useState(false)
  const [errorDialog, setErrorDialog] = useState(null);
  const [email, setEmail] = useState("")
  const [isLoadingEmailGeneration, setIsLoadingEmailGeneration] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)

  const textareaRef = useRef(null)

  const handleSendMessage = async () => {
    setIsLoadingEmailGeneration(true)
    if (!selectedTask && !userText.trim()) return

    const fullMessage = selectedTask
      ? `${selectedTask}: ${userText}`
      : userText

    const userMessage = {
      id: Date.now().toString(),
      content: fullMessage,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setUserText("")
    setSelectedTask("")
    setShowPopover(false)

    try {
      const res = await makeRequest("generate-email", {
        method: "POST",
        body: JSON.stringify(fullMessage),
      })

      if (res.status === "error") {
        setErrorDialog(res.reason); // show dialog
        return;
      }
      else if (res.status === "rate_limit_error") {
        setErrorDialog(res.reason);
        return;
      }

      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content: res.data, // this is { from_, to, subject, body }
        isUser: false,
        isEmail: true,
        showEmail: true,
        sent: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setEmail(`To: ${res.data.to_email}\nSubject: ${res.data.subject}\n\n${res.data.body}`)

    } catch (err) {
      console.error(err)
    } finally {
      setIsLoadingEmailGeneration(false)
    }
  }


  const handleEmailSend = async (id) => {
    console.log(email);
    if (!email.trim()) return;

    try {
      setIsSendingEmail(true);

      const res = await makeRequest("send-email", {
        method: "POST",
        body: JSON.stringify(email),

      });

      if (res.status === "error") {
        setErrorDialog(res.reason); // show dialog
      }
      else if (res.status === "success") {

        toast.success("Email has been sent", {
          position: "bottom-right",
        });

        setMessages(prev =>
          prev.map(msg =>
            msg.id === id ? { ...msg, sent: true } : msg
          )
        );
      }

    } catch (err) {
      console.error("❌ Error sending request:", err);
      setErrorDialog("Network error. Please try again.");
    } finally {
      setEmail("");
      setIsSendingEmail(false);
    }
  };

  const handleChange = e => {
    setUserText(e.target.value)
  }

  const handleKeyPress = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleTaskSelect = task => {
    setSelectedTask(task)
    setShowPopover(false)
    textareaRef.current.focus()
  }

  const handleCancelEmail = () => {
    setMessages((prev) => prev.slice(0, -2)); // remove last 2 messages (user + AI email)
  };


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
    <div>
      <ToastContainer />
      <div className="w-120 bg-light-background dark:bg-dark-background border-l border-accent/20 flex flex-col h-full ">
        {/* Header */}
        <div className="p-4 border-b border-accent/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="text-primary" size={20} />
            <h3 className="font-semibold text-light-text dark:text-dark-text">AI Assistant</h3>
          </div>
          <button
            onClick={onToggleMinimize}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Minimize2 size={16} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.isUser ? "justify-end" : "justify-start"}`}
            >
              {/* AI avatar (left side) */}
              {!message.isUser && (
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-blue-600" />
                </div>
              )}

              {/* Message content */}
              {message.isEmail && message.showEmail && !message.sent ? (
                // AI-generated email block (left side)
                <div className="flex flex-col gap-2 w-full max-w-[400px]">
                  <textarea
                    defaultValue={`To: ${message.content.to_email}\nSubject: ${message.content.subject}\n\n${message.content.body}`}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-sm border text-light-text scrollbar-hide dark:text-dark-text border-accent/20 rounded-lg p-2 resize-none focus:outline-none field-sizing: content;"
                    rows={6}
                  />
                  <div className="flex gap-2">
                    <button disabled={isSendingEmail}
                      onClick={() => handleEmailSend(message.id)}
                      className="px-4 py-2 bg-primary text-light-text rounded-lg hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed">
                      <span className="truncate">{isSendingEmail ? "Sending..." : "Send"}</span>
                    </button>
                    <button
                      onClick={() => handleCancelEmail(message.id)}
                      className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>

                  </div>
                </div>
              ) : message.isEmail && message.sent ? (
                // ✅ Static text after send
                <div>
                  <div className="max-w-[400px] rounded-lg px-3 py-2 bg-accent/10 text-dark-text">
                    <p className="text-sm whitespace-pre-wrap">
                      To: {message.content.to_email}{"\n"}
                      Subject: {message.content.subject}{"\n\n"}
                      {message.content.body}
                    </p>
                  </div>
                  <button disabled={true}
                    className="mt-2 px-4 py-2 bg-primary text-light-text rounded-lg disabled:opacity-50">
                    Sent
                  </button></div>
              ) : (
                // Normal bubble (user on right, AI on left)
                <div
                  className={`max-w-[250px] rounded-lg px-3 py-2 ${message.isUser
                    ? "bg-primary text-light-text"
                    : "bg-secondary/10 dark:bg-accent/10 dark:text-dark-text"
                    }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              )}

              {/* User avatar (right side) */}
              {message.isUser && (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={16} className="text-gray-600" />
                </div>
              )}
            </div>
          ))}

          {/* Inline Loader as AI message */}
          {isLoadingEmailGeneration && (
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot size={16} className="text-blue-600" />
              </div>
              <div className="p-4 max-w-2xl rounded-2xl bg-secondary/10 bg-opacity-50 rounded-tl-sm flex items-center justify-center">
                <l-infinity
                  size="35"
                  stroke="3"
                  stroke-length="0.15"
                  bg-opacity="0.1"
                  speed="1.3"
                  color="white"
                ></l-infinity>
              </div>
            </div>
          )}
        </div>

        {/* Input + Popover */}
        {isUserLoggedIn && (
          <div className="p-4 border-t border-accent/70 relative">
            {showPopover && (
              <div className="absolute bottom-14 left-4 bg-white dark:bg-dark-background border-1 dark:text-dark-text dark:border-gray-700 rounded-xl shadow-xl z-10 w-64 overflow-hidden">
                <ul className="text-sm">
                  {/* {["Write an Email", "Reply to an Email", "Summarize an Email"].map(task => ( */}
                  {["Write an Email"].map(task => (
                    <li
                      key={task}
                      onClick={() => handleTaskSelect(task)}
                      className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    >
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-2 items-end">
              <div className="flex-1 flex items-start flex-wrap px-3 py-2 border border-accent/20 rounded-lg focus-within:ring-2 focus-within:ring-primary text-sm text-light-text dark:text-dark-text bg-white dark:bg-dark-background">
                {selectedTask && (
                  <span className="flex items-center bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full mr-2 mb-1">
                    {selectedTask}
                    <button
                      onClick={() => setSelectedTask("")}
                      className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none"
                    >
                      ❌
                    </button>
                  </span>
                )}

                <textarea
                  ref={textareaRef}
                  value={userText}
                  onChange={handleChange}
                  onInput={e => {
                    e.target.style.height = "auto"
                    e.target.style.height = `${e.target.scrollHeight}px`
                  }}
                  onFocus={() => !selectedTask && userText.trim() === "" && setShowPopover(true)}
                  onBlur={() => setTimeout(() => setShowPopover(false), 150)}
                  onKeyPress={handleKeyPress}
                  placeholder={selectedTask ? "Continue writing..." : "Ask me anything about emails..."}
                  rows={1}
                  className="flex-1 min-h-[24px] resize-none overflow-hidden focus:outline-none text-sm bg-transparent"
                />

              </div>
              <button
                onClick={handleSendMessage}
                disabled={!selectedTask && !userText.trim()}
                className="p-2 bg-primary text-white rounded-lg hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        )}

        {!isUserLoggedIn && (
          <div className="flex items-center justify-center h-64 text-gray-500 dark:text-dark-text/50 w-50 m-auto">
            <div className="text-center">
              <p>Sign In with your Email to enable the AI email features</p>
            </div>
          </div>
        )}

      </div>
      {/* Error Dialog */}
      {errorDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity duration-300">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-transform duration-300 scale-100">
            <h2 className="text-lg font-bold mb-4 text-red-600">Error</h2>
            <p className="mb-6 text-gray-700">{errorDialog}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setErrorDialog(null)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

  )
}
