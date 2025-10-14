"use client";

import { MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { chatSuggestions, heroConfig } from "@/config/chatConfig";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
} from "@/components/ui/expandable-chat";
import { ChatService, ChatMessage } from "@/services/chatService";
import { useChatContext } from "@/contexts/ChatContext";
import SendIcon from "./icons/SendIcon";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: string;
  isStreaming?: boolean;
}

const ChatBubble: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const chatService = useRef(new ChatService());
  const { analysisData, fileName } = useChatContext();

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage = analysisData
      ? `Hello! I'm your DPR Assistant. I have analyzed the document "${fileName}" and can answer questions about it. How can I help you?`
      : "Hello! I'm your DPR Assistant. Please upload and analyze a DPR document first, then I can help you with specific questions about it.";

    setMessages([
      {
        id: 1,
        text: welcomeMessage,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  }, [analysisData, fileName]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    const messageText = newMessage.trim();
    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsLoading(true);

    // Create a temporary bot message for streaming
    const botMessageId = Date.now() + 1;
    const botMessage: Message = {
      id: botMessageId,
      text: "",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, botMessage]);

    // Send the message using the chat service
    await sendMessage(messageText, botMessageId);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setNewMessage(suggestion);
    // Auto-send the suggestion
    const userMessage: Message = {
      id: Date.now(),
      text: suggestion,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Create a temporary bot message for streaming
    const botMessageId = Date.now() + 1;
    const botMessage: Message = {
      id: botMessageId,
      text: "",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, botMessage]);

    // Send the message
    sendMessage(suggestion, botMessageId);
  };

  const sendMessage = async (messageText: string, botMessageId: number) => {
    try {
      // Prepare conversation history for Gemini API format
      // Filter out welcome messages and ensure proper conversation flow
      const conversationHistory = messages.filter(
        (msg) =>
          // Exclude the initial welcome message and current streaming message
          msg.id !== 1 && msg.id !== botMessageId && msg.text.trim() !== ""
      );

      const history: ChatMessage[] = conversationHistory.map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

      const responseStream = await chatService.current.sendMessage(
        messageText,
        history,
        analysisData,
        fileName
      );

      let accumulatedText = "";

      for await (const chunk of responseStream) {
        accumulatedText += chunk;

        // Update the streaming message in real-time
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId
              ? { ...msg, text: accumulatedText, isStreaming: true }
              : msg
          )
        );
      }

      // Finalize the message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? { ...msg, text: accumulatedText, isStreaming: false }
            : msg
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? {
                ...msg,
                text: "I'm sorry, I'm having trouble responding right now. Please try again later.",
                isStreaming: false,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      setNewMessage("");
    }
  };

  return (
    <ExpandableChat
      className="hover:cursor-pointer max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-4rem)] md:max-w-xl max-h-[95vh]"
      position="bottom-right"
      size="lg"
      icon={<MessageCircle className="h-6 w-6" />}
    >
      <ExpandableChatHeader>
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8 border-2 border-primary bg-blue-300 dark:bg-yellow-300">
            <AvatarImage src="/assets/logo.png" alt="Assistant" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm">{heroConfig.name}</h3>
            <div className="text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Online
              </div>
            </div>
          </div>
        </div>
      </ExpandableChatHeader>

      <ExpandableChatBody>
        <ScrollArea ref={scrollAreaRef} className="h-full p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex w-max max-w-xs flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                  message.sender === "user"
                    ? "ml-auto text-secondary bg-muted"
                    : "bg-muted"
                )}
              >
                <div className="flex items-start space-x-2">
                  {message.sender === "bot" && (
                    <Avatar className="h-6 w-6 border-2 border-primary bg-blue-300 dark:bg-yellow-300">
                      <AvatarImage src="/assets/logo.png" alt="Assistant" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex-1 md:max-w-sm max-w-xs">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 prose prose-sm max-w-none dark:prose-invert">
                        {message.text ? (
                          <ReactMarkdown
                            components={{
                              a: (props) => (
                                <a
                                  {...props}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:text-blue-700 underline break-words"
                                />
                              ),
                              // Custom paragraph component to remove default margins
                              p: (props) => (
                                <p {...props} className="m-0 leading-relaxed" />
                              ),
                              // Custom list components
                              ul: (props) => (
                                <ul {...props} className="m-0 pl-4" />
                              ),
                              ol: (props) => (
                                <ol {...props} className="m-0 pl-4" />
                              ),
                              li: (props) => <li {...props} className="m-0" />,
                              // Custom strong/bold component
                              strong: (props) => (
                                <strong {...props} className="font-semibold" />
                              ),
                            }}
                          >
                            {message.text}
                          </ReactMarkdown>
                        ) : (
                          message.isStreaming && (
                            <span className="text-muted-foreground">
                              Thinking...
                            </span>
                          )
                        )}
                      </div>
                    </div>
                    <p
                      className={cn(
                        "text-xs mt-1",
                        message.sender === "user"
                          ? "text-secondary"
                          : "text-muted-foreground"
                      )}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Show suggestions only when conversation just started and no analysis data */}
            {messages.length === 1 && !isLoading && !analysisData && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground px-3">
                  Quick questions:
                </p>
                <div className="flex flex-wrap gap-2 px-3">
                  {chatSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs h-8 px-3 bg-background hover:bg-muted border-muted-foreground/20"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </ExpandableChatBody>

      <ExpandableChatFooter>
        <div className="flex space-x-2">
          <Input
            placeholder={
              analysisData
                ? "Ask me about the analysis..."
                : "Upload a DPR document first..."
            }
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            size="sm"
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isLoading}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <SendIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </ExpandableChatFooter>
    </ExpandableChat>
  );
};

export default ChatBubble;
