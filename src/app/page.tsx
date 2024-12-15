import { Button } from "@/components/ui/button";
import DropPdfs from "@/components/ui/DropPdfs";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();
  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-rose-100 to-teal-100">
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center  text-center">
          <div className="flex items-center">
            <h1 className="text-5xl mr-3 font-semibold">Chat with Pdf</h1>
            <UserButton />
          </div>
          <div className="flex mt-2">
            {userId && <Button>Go To Chats</Button>}
          </div>
          <p className="max-w-xl mt-1 text-lg text-slate-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo
            minus eius velit impedit, fugiat voluptate exercitationem
            consequatur
          </p>
          {userId ? (
            <div className="w-full">
              <DropPdfs />
            </div>
          ) : (
            <Link href="/sign-in">
              <Button className="mt-2">Login To get Started</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
