"use client";

import { uploadToS3 } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Inbox, Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

function DropPdfs() {
  const router = useRouter()
  const [uploading, setUploading] = useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const responses = await axios.post("/api/create-chat", {
        file_key,
        file_name,
      });
      return responses.data;
    },
  });
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Do something with the files
    console.log(acceptedFiles);
    const file = acceptedFiles[0];
    if (file.size > 10 * 1024 * 1024) {
      toast.error("maximum file size is 10 mb");
      return;
    }
    try {
      setUploading(true);
      const data = await uploadToS3(file);

      if (!data?.file_key || !data.file_name) {
        toast.error("something went wrong");
        return;
      }
      mutate(data, {
        onSuccess: (data) => {
          console.log(data);
          toast.success(data.message);
          router.push(`/chats/${data.chat_id}`)
        },
        onError: (error) => {
          console.log(error);
          toast.error("error creating chat");
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  return (
    <div className="p-2 bg-white rounded-xl mt-2">
      <div
        {...getRootProps({
          className:
            " border-dashed border-2 w-full flex items-center justify-center bg-gray-50 cursor-pointer py-8  flex-col  rounded-xl",
        })}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <>
            {isPending || uploading ? (
              <>
                <Loader2 className=" w-10 h-10 text-blue-500 animate-spin " />
                <p className="text-sm mt-2 text-black">Gpt Cooking....</p>
              </>
            ) : (
              <>
                <Inbox className=" w-10 h-10 text-blue-500 " />
                <p className="text-sm mt-2 text-black">Drop pdf here</p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default DropPdfs;
