import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
export async function downloadFromS3(file_key: string) {
  try {
    const s3Client = new S3Client({
      region: "eu-north-1",
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
      },
      // Enable SDK to reuse HTTP connections
      requestHandler: {
        connectionTimeout: 5000,
        socketTimeout: 5000,
      },
    });
    console.time("s3Download");
    const command = new GetObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
      Key: file_key,
    });

    const { Body } = await s3Client.send(command);
    if (!Body) {
      throw new Error("No PDF content found in S3 object");
    }
    
    return Body;
  } catch (error) {
    console.log(error);
    return null;
  }
}
