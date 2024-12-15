import ChatComponent from "@/components/ChatComponent";
import ChatSidebar from "@/components/ChatSidebar";
import PDFViewer from "@/components/PDFViewer";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { Sidebar } from "lucide-react";
import { redirect } from "next/navigation";
import React, { useState } from "react";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const { userId } = await auth();
  
  if (!userId) {
    return redirect("/sign-in");
  }
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));

  const chat = _chats.find((child) => child.id === parseInt(id));
  if (!chat) {
    return redirect("/");
  }

  
  return (
    <div className="flex max-h-screen ">
      <div className="w-full flex max-h-screen ">
        <div className=" flex">
          
          <div className="flex-[1] max-w-xs  z-10">
             <ChatSidebar chats={_chats} chatId={id} />
          </div>
        </div>

        <div className="flex-[5] max-h-screen flex p-2 ">
          <PDFViewer pdfUrl={chat.pdfUrl} />
        </div>

        <div className="flex-[3] min-h-screen border-l-4 border-slate-200 max-lg:flex-[5]">
          <ChatComponent chatId={chat.id} />
        </div>
      </div>
    </div>
  );
}

export default page;
