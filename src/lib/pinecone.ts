import { Pinecone } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./server-S3";
import pdf from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { getEmbedding } from "./openAIEmbedding";
import md5 from "md5";
import { convertToPineconeNamespace } from "./utils";

let pinecone: Pinecone | null;

export async function getPineconeClient() {
  if (!pinecone) {
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }
  return pinecone;
}

export async function loadS3IntoPinecone(file_Key: string) {
  console.log("downloading from s3....");
  const pdfBuffer = await downloadFromS3(file_Key);
  if (!pdfBuffer) {
    throw new Error("unable to download");
  }
  const chunks: Uint8Array[] = [];
  for await (const chunk of pdfBuffer as any) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  console.timeEnd("s3Download");

  // 2. Parse PDF with performance options
  console.time("pdfParse");
  const data = await pdf(buffer, {
    max: 0, // No page limit
    version: "v2.0.550", // Use latest pdf.js
  });
  console.timeEnd("pdfParse");
  const text = data.text.replace(/\n/g, '');

  //  have to remove /n

  console.log(text)
  // Split text into chunks
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const splitDocs = await textSplitter.createDocuments(
    [text],
    [
      {
        source: file_Key,
        pdf_numpages: data.numpages,
      },
    ]
  );
  // creating vectors
  const vectors = await getEmbeddedContent(splitDocs);
  const pinecone = await getPineconeClient();
  const index = pinecone.index(process.env.PINECONE_INDEX || "chat-pdf-nav");

  console.log("insering vectors to pinecone");

  

  try {
    const namespace = convertToPineconeNamespace(file_Key);
    await index.namespace(namespace).upsert(vectors);
    console.log(namespace);
    return namespace;
  } catch (error) {
    console.log(error);
    throw new Error("error pinecone");
  }
}

export interface Document {
  metadata: any;
  pageContent: string;
}

export async function getEmbeddedContent(doc: Document[]) {
  const embeddings = await getEmbedding(doc);

  const records = doc.map((d, i) => ({
    id: md5(d.pageContent),
    values: embeddings[i].values || [],
    metadata: { text: d.pageContent },
  }));

  return records;
}
