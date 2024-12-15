import { db } from "@/lib/db";
import { messagesTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge"

export async function POST(req:Request){
    const {chatId} = await req.json()
    const _messages = await db.select().from(messagesTable).where(eq(messagesTable.chatId,chatId))
    return NextResponse.json({
        messages:_messages || []
    })
}