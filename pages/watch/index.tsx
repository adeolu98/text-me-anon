import { AppLayout } from "@/components/AppLayout";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { useEffect } from "react";
import { isAddress } from "ethers/lib/utils.js";
import ChatMessages from "@/components/ChatMessages";
import { ChatMode } from "@/lib/types";
import { ChatSearch } from "@/components/SearchInput";
import LandingPage from "@/components/LandingPage";

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
        <LandingPage mode={ChatMode.WATCH}/>
      )}
    </AppLayout>
  );
};

export default Chat;
