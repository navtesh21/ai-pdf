import { getPineconeClient } from "./pinecone";



const model = 'multilingual-e5-large';
export interface Document {
    metadata: any;
    pageContent: string;
  }

export async function getEmbedding(data:Document[]) {
    const pc = await getPineconeClient()
    try {
      const embeddings = await pc.inference.embed(
        model,
        data.map((d) => d.pageContent),
        { inputType: 'passage', truncate: 'END' }
      );
      

      return embeddings
    } catch (error) {
      console.log(error,"due to name")
      throw new Error("huhuhuhuh")
    }
  
}