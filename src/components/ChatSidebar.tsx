"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { MessageCircle, PlusCircle, AlignLeft, X } from "lucide-react";
import { Item } from "@/lib/db/schema";

function ChatSidebar({ chats, chatId }: { chats: Item[]; chatId: string }) {
  const [sidebar, showSidebar] = useState(false);

  return (
    <>
      {!sidebar && (
        <AlignLeft className="w-7 h-7 m-2 mt-6 " onClick={() => showSidebar(true)} />
      )}

      {sidebar && (
        <div className="absolute">
        <div
        className={`fixed top-0 left-0  h-screen bg-gray-900 text-white p-4 z-10 transform transition-transform duration-300 ease-in-out ${
          sidebar ? "translate-x-0" : "-translate-x-full"
        }`}>
          <div className="flex gap-2 w-full items-center">
            <X className="mr-2 w-7 h-7 text-slate-400 hover:text-white" onClick={() => showSidebar(false)} />

            <Link href={"/"} className="w-full">
              <Button className="p-4 border-dashed border-4 border-white w-full">
                {" "}
                <PlusCircle className="mr-2 w-4 h-4" /> New chat
              </Button>
            </Link>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            {chats.map((chat) => {
              return (
                <Link href={`${chat.id}`}>
                  <div
                    className={`rounded-lg p-3 flex items-center text-slate-300 ${
                      chat.id === parseInt(chatId)
                        ? " bg-blue-600 text-white"
                        : " hover:text-white"
                    }`}
                  >
                    <MessageCircle className="mr-2 w-4 h-4" />
                    <p className=" w-full truncate text-sm ">{chat.pdfName}</p>
                  </div>
                </Link>
              );
            })}

            <div className="absolute bottom-4 left-4 flex gap-2 text-sm items-center text-slate-500 text-wrap ">
              <Link href={"/"}>Home</Link>
              <Link href={"/"}>Source</Link>
            </div>
          </div>
        </div>
        </div>
      )}
    </>
  );
}

export default ChatSidebar;
