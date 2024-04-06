import { useState } from "react";
import axios from "axios";
import "./Chatbot.css";
import { useMutation } from "@tanstack/react-query";
import { SiChatbot } from "react-icons/si";
import { BiSend } from "react-icons/bi";
import { MdScheduleSend } from "react-icons/md";

// function to make the http request (useMutation)
const sendMessageAPI = async (message) => {
    const res = await axios.post("https://chatbot-openai-lac.vercel.app/", { message });
    return res.data;
};

const Chat = () => {
    const [message, setMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [conversations, setConversations] = useState([
        { role: "assistant", content: "Hello! How can I help you?" },
    ]);

    // mutation logic
    const mutation = useMutation({
        mutationFn: sendMessageAPI,
        mutationKey: ["chatbot"],
        onSuccess: (data) => {
            setIsTyping(false);
            setConversations((prevConversation) => [
                ...prevConversation,
                { role: "assistant", content: data.message },
            ]);
        },
    });

    // handle submit
    const handleSubmitMessage = () => {
        const currentMessage = message.trim();
        if (!currentMessage) {
            alert("please enter a message");
            return;
        }

        setConversations((prevConversation) => [
            ...prevConversation,
            { role: "user", content: currentMessage },
        ]);

        setIsTyping(true);
        mutation.mutate(currentMessage);
        setMessage("");
    }

    return (
        <>
            <div className="header">
                <h1 className="title">AI Chatbot</h1>
                <p className="description">
                    Enter your message in the input below to chat with the AI
                </p>
                <div className="chat-container">
                    <div className="conversation">
                        {conversations.map((entry, index) => (
                            <div className={`message ${entry.role}`} key={index}>
                                <strong>
                                    {entry.role === "user" ? "You" : <SiChatbot />}:
                                </strong>
                                -{entry.content}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="message assistant">
                                <strong><SiChatbot /> is typing...</strong>
                            </div>
                        )}
                    </div>

                    <div className="input-area">
                        <input
                            type="text"
                            placeholder="Enter message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSubmitMessage()}
                        />
                        <button onClick={handleSubmitMessage}>
                            {mutation?.isPending ? <MdScheduleSend /> : <BiSend />}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Chat;