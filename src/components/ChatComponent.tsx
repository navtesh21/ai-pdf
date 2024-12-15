"use client";
import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Send } from "lucide-react";
import { Message, useChat } from "ai/react";
import Markdown from "react-markdown";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function ChatComponent({ chatId }: { chatId: number }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const responses= await axios.post("/api/get-messages", { chatId });
      return responses.data.messages;
    },
  });
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "http://localhost:3000/api/chat",
    body: {
      chatId: chatId,
    },
    initialMessages: data || [],
  });
  console.log(messages);

  return (
    <div className="relative h-screen overflow-scroll">
      <div className="sticky top-0 bg-white h-fit">
        <h3 className=" text-xl font-bold">Chat</h3>
      </div>

      <div className="flex flex-col gap-2 m-4">
        {messages &&
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.role === "user" ? "justify-end pl-10" : "justify-start pr-10"
              }`}
            >
              <p
                className={`rounded-lg px-3 text-sm py-1 shadow-md ring-1 ring-gray-900/10 ${
                  m.role === "user" ? "bg-blue-600 text-white " : "text-left"
                }`}
              >
                <Markdown>{m.content}</Markdown>
              </p>
            </div>
          ))}
      </div>

      <form
        className="sticky bottom-0 inset-x-0 px-2 py-4 bg-white"
        onSubmit={handleSubmit}
      >
        <div className="flex w-full items-center space-x-2">
          <Input
            type="message"
            placeholder="Ask anything...."
            value={input}
            onChange={handleInputChange}
          />
          <Button type="submit" className="bg-blue-600">
            {" "}
            <Send />{" "}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ChatComponent;
