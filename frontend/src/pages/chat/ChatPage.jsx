import '../../index.css';
import { RiRobot3Fill } from "react-icons/ri";
import { useChat } from "./ChatContext";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApi } from "../../utils/api";
import { infinity } from 'ldrs'
import { UserButton } from "@clerk/clerk-react";
import { useUser, useClerk } from "@clerk/clerk-react";

infinity.register()

function ChatPage() {
    const { user } = useUser();
    const { messages,
        setMessages,
        isLoading,
        setIsLoading,
        chats,
        setChats,
        activeChat,
        setActiveChat, isNewChat, setIsNewChat } = useChat();

    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);
    const { makeRequest } = useApi();

    // ✅ Auto-scroll when new messages arrive
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // ✅ Fetch chat history
    useEffect(() => {
        fetchChats();
    }, []);

    const fetchChats = async () => {
        try {
            const res = await makeRequest("get-chats", { method: "GET" });

            // Map backend response to frontend expected format
            const formattedChats = (res.chats || []).map(chat => ({
                id: chat.chat_id,
                title: chat.chat_title
            }));

            setChats(formattedChats);
        } catch (err) {
            console.error("Error fetching chats:", err);
        }
    };


    // ✅ Load messages when clicking a chat
    const handleSelectChat = async (chatId) => {
        try {
            setActiveChat(chatId);
            setIsNewChat(false)

            const res = await makeRequest(`get-chat-messages/${chatId}`, {
                method: "GET",
            });

            setMessages(res.messages);
        } catch (err) {
            console.error("Error fetching chat messages:", err);
        }
    };


    // ✅ Handle Send
    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { sender: "user", message_content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        const textarea = document.getElementById("chat-input");
        if (textarea) textarea.style.height = "48px";

        try {
            const allMessages = [...messages, userMessage]; // include new message
            const conversation = allMessages.map(({ message_id, time_date, ...rest }) => rest);

            // Set loading state
            setIsLoading(true);

            // Send to backend
            const res = await makeRequest("ai-chat-answer", {
                method: "POST",
                body: JSON.stringify({
                    conversation: conversation,
                    new_chat: isNewChat, // <-- flag for backend
                    chat_id: activeChat // null if new chat
                }),
            });

            const aiText = res.ai_reply;
            const chatIdFromBackend = res.chat_id;


            setIsLoading(false)

            // Update activeChat if this was a new chat
            if (isNewChat && chatIdFromBackend) {
                setActiveChat(chatIdFromBackend);
                setIsNewChat(false); // reset flag
            }

            // Push placeholder AI message first
            setMessages((prev) => [...prev, { sender: "assistant", message_content: "" }]);

            // Typing effect
            const length = aiText.length;
            const minDuration = 2000;
            const maxDuration = 10000;
            let targetDuration = length * 25;
            targetDuration = Math.min(Math.max(targetDuration, minDuration), maxDuration);
            const interval = targetDuration / length;

            let i = 0;
            const typingInterval = setInterval(() => {
                i++;
                setMessages((prev) => [
                    ...prev.slice(0, -1),
                    { sender: "assistant", message_content: aiText.slice(0, i) },
                ]);

                if (i >= length) {
                    clearInterval(typingInterval);
                    setIsLoading(false);
                }
            }, interval);
        } catch (err) {
            console.error("Error sending messages to backend:", err);
            setIsLoading(false);
        }
        finally {
            fetchChats();
        }
    };


    return (
        <>

            <style>{`
                /* Hide scrollbar but keep wheel/trackpad scrolling */
                .no-scrollbar {
                    -ms-overflow-style: none;      /* IE/Edge */
                    scrollbar-width: none;         /* Firefox */
                    overscroll-behavior: contain;  /* prevent parent scroll on overscroll */
                }
                .no-scrollbar::-webkit-scrollbar { 
                    width: 0; height: 0;           /* Chrome/Safari */
                }
                `}
            </style>



            <div className="h-[calc(100vh-4rem)] bg-background text-light-text dark:text-dark-text flex">
                {/* ✅ Fixed Sidebar */}
                <div className="fixed left-0  h-full w-[20%] bg-gradient-to-b from-secondary/10 to-background border-r border-secondary/20 flex flex-col">
                    <div className="p-6 pb-0">
                        <div className="flex items-center mb-8">
                            <div className="bg-custom-primary p-2 rounded-lg mr-4">
                                <RiRobot3Fill size={30} />
                            </div>
                            <div>
                                <h1 className="font-bold text-xl">Life Assistant</h1>
                                <p className="text-sm text-gray-400">Smart Life Assistant</p>
                            </div>
                        </div>
                        <button
                            className="mb-8 w-full cursor-pointer bg-primary hover:bg-primary/90 text-background dark:text-light-text font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                            onClick={() => {
                                setMessages([{ sender: "assistant", message_content: "Hi 👋 How can I help you today?" }]);
                                setInput("");
                                setActiveChat(null);
                                setIsNewChat(true);
                            }}
                        >
                            <span className="material-icons">add</span>
                            New Chat
                        </button>

                    </div>
                    <div className="border-b border-secondary/20"></div>
                    {/* <div className="p-6 flex-1 overflow-y-auto scrollbar-hide space-y-4">
                        <div className="chat-history-item hover:bg-secondary/20 p-3 rounded-lg cursor-pointer transition-colors">
                            <div className="text-sm font-medium text-text">Budget Analysis Q4</div>
                        </div>
                        <div className="chat-history-item hover:bg-secondary/10 p-3 rounded-lg cursor-pointer transition-colors bg-secondary/10 border-l-2 border-primary">
                            <div className="text-sm font-medium text-text">Monthly Budget Setup</div>
                        </div>
                    </div> */}
                    {/* Sidebar Chat History */}
                    <div className="p-6 flex-1 overflow-y-auto scrollbar-hide space-y-4">
                        {chats.map((chat, idx) => (
                            <div
                                key={chat.id || idx} // fallback to idx if id is missing
                                onClick={() => handleSelectChat(chat.id)}
                                className={`chat-history-item hover:bg-secondary/10 p-3 rounded-lg cursor-pointer transition-colors 
                                ${activeChat === chat.id ? "bg-secondary/10 border-l-2 border-primary" : ""}`}
                            >
                                <div className="text-sm font-medium text-text">{chat.title}</div>
                            </div>
                        ))}

                    </div>

                </div>

                {/* ✅ Main Chat Area */}
                <div className="ml-[20%] flex-1 flex flex-col">
                    {/* Header (optional, fixed at top inside main area) */}
                    {/* Chat Section (scrollable, avoids overlap) */}
                    <main
                        className="flex-1 overflow-y-auto px-6 py-4 pb-30"
                        style={{
                            paddingBottom: "160px", // reserve space equal to input height
                        }}
                    >
                        <div className="space-y-8">
                            <AnimatePresence initial={false}>
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex items-start gap-4 ${msg.sender === "user" ? "justify-end" : ""
                                            }`}
                                    >
                                        {msg.sender === "assistant" && (
                                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                                <RiRobot3Fill color="black" />
                                            </div>
                                        )}


                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className={`p-4 max-w-2xl rounded-2xl ${msg.sender === "user"
                                                ? "bg-primary text-[#0e1f0f] rounded-tr-sm"
                                                : "bg-secondary/10 bg-opacity-50 rounded-tl-sm"
                                                }`}
                                        >
                                            <p className="whitespace-pre-wrap break-words">
                                                {msg.message_content}
                                            </p>

                                        </motion.div>

                                        {msg.sender === "user" && (
                                            <button
                                                className="rounded-full w-8 h-8 overflow-hidden"
                                            >
                                                <img
                                                    src={user?.imageUrl}
                                                    alt="User Avatar"
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>
                                ))}

                                {/* Inline Loader as AI message */}
                                {isLoading && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                            <RiRobot3Fill color="black" />
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
                            </AnimatePresence>
                        </div>
                    </main>

                    {/* ✅ Fixed Input Box */}
                    <div
                        id="input-area"
                        className="fixed bottom-0 left-[20%] w-[80%] border-t border-secondary/20 bg-light-background dark:bg-dark-background p-4"
                    >
                        <form
                            onSubmit={handleSend}
                            className="flex items-end space-x-3 max-w-4xl mx-auto relative"
                        >
                            {/* Attach */}
                            <button className="p-3 text-text/60 hover:text-text hover:bg-secondary/10 rounded-lg transition-colors">
                                📎
                            </button>

                            {/* Auto-resizing textarea */}
                            <textarea
                                id="chat-input"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask me about budgeting, savings, or expense analysis..."
                                className="no-scrollbar w-full bg-secondary/10 border border-secondary/20 rounded-2xl px-4 py-3 pr-12 
                text-light-text dark:text-dark-text placeholder-light-text/50 dark:placeholder-dark-text/50 focus:outline-none focus:ring-2 focus:ring-primary 
                focus:border-transparent resize-none overflow-y-auto break-words whitespace-pre-wrap 
                transition-all duration-200 ease-in-out"
                                rows={1}
                                spellCheck="false"
                                style={{
                                    minHeight: "48px",
                                    maxHeight: "160px"
                                }}
                                onInput={(e) => {
                                    e.target.style.height = "48px"; // reset
                                    e.target.style.height =
                                        Math.min(e.target.scrollHeight, 160) + "px";
                                }}
                            />

                            {/* Send */}
                            <button
                                id="send-btn"
                                className="absolute right-5 bottom-2 w-8 h-8 bg-primary hover:bg-primary/90 text-light-text rounded-lg flex items-center justify-center transition-colors"
                            >
                                ➤
                            </button>
                        </form>
                        <div className="text-center mt-2">
                            <p className="text-xs text-text/40">
                                AI can make mistakes. Consider checking important information.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );

}

export default ChatPage;