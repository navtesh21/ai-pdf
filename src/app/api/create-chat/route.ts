import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { getS3Url } from "@/lib/s3";
import { auth } from "@clerk/nextjs/server";
import { NextResponse,NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const{ userId} = await auth()
  if(!userId){
    return NextResponse.json({message:"unauthorized"})
  }
  try {
    const body = await request.json();
    const { file_key, file_name } = body;
    console.log(file_key, file_name);
    const pages = await loadS3IntoPinecone(file_key);
   const chat_id = await db.insert(chats).values({
      fileKey:file_key,
      pdfName:file_name,
      pdfUrl:getS3Url(file_key),
      userId:userId

    }).returning({
      insertedId:chats.id
    })
    return NextResponse.json({
      message: "successfully uploaded",
      pages: pages,
      chat_id:chat_id[0].insertedId
    });
  } catch (error) {
    console.log("error");
    return NextResponse.json(
      {
        error: "internal server error",
      },
      { status: 500 }
    );
  }
}
