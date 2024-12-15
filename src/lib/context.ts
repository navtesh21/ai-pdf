import { getPineconeClient } from "./pinecone";
import { convertToPineconeNamespace } from "./utils";

async function createQueryWithVectors(query: string[]) {
  const pc = await getPineconeClient();
  const queryEmbedding = await pc.inference.embed(
    "multilingual-e5-large",
    query,
    { inputType: "query" }
  );
  return queryEmbedding;
}

export async function searchVectorDb(query: string[], file_Key: string) {
  const queryEmbedding = await createQueryWithVectors(query);
  const pinecone = await getPineconeClient();

  const namespace = convertToPineconeNamespace(file_Key);
  const index = pinecone.index(process.env.PINECONE_INDEX || "chat-pdf-nav");
  const queryResponse = await index.namespace(namespace).query({
    topK: 5,
    vector: queryEmbedding[0].values!,
    includeValues: false,
    includeMetadata: true,
  });
  const qualifyingDocs = queryResponse.matches.filter(
    (match) => match.score && match.score > 0.7
  );

  type Metadata = {
    text: string;
  };
  let docs = qualifyingDocs.map((doc) => (doc.metadata as Metadata).text);
 
  return docs.join("\n").substring(0,3000);
}
