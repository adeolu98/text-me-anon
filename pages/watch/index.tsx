import { AppLayout } from "@/components/AppLayout";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { useEffect } from "react";
import { isAddress } from "ethers/lib/utils.js";
import ChatMessages from "@/components/ChatMessages";
import { ChatMode } from "@/lib/types";
import { ChatSearch } from "@/components/SearchInput";

const Chat: NextPage = () => {
  const router = useRouter();
  const { sender, receiver } = router.query

  // navigate to home if addresses are invalid
  useEffect(() => {
    if (
      (sender &&
      (typeof sender !== "string" || !isAddress(sender))) ||
      (receiver &&
      (typeof receiver !== "string" || !isAddress(receiver))) &&
      router
    ) {
      console.log("pushing")
      router.push("/");
    }
  }, [receiver, router, sender]);

  return (
    <AppLayout>
      {typeof sender === "string" &&
      typeof receiver === "string" &&
      isAddress(sender) &&
      isAddress(receiver) ? (
        typeof sender === "string" &&
        typeof receiver === "string" && (
          <ChatMessages
            mode={ChatMode.WATCH}
            sender={sender}
            receiver={receiver}
          />
        )
      ) : (
        <div className="bg-[#fafafa] h-full w-full flex items-center translate-y-1 justify-center flex-col sm:w-4/6 md:w-4/6 lg:w-3/6 xl:w-2/6">
          <div className="-translate-y-full w-full">
            <p className="text-center font-xl mb-2">
              Enter an address below to view its on-chain messages
            </p>
            <ChatSearch placeholder="0x" classNames="w-full md:w-full max-w-full" />
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default Chat;
