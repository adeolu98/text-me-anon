import { AppLayout } from "@/components/AppLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { useEffect } from "react";
import { isAddress } from "ethers/lib/utils.js";
import ChatMessages from "@/components/ChatMessages";
import { ChatMode } from "@/lib/types";

const Chat: NextPage = () => {
  const router = useRouter();
  const { sender, receiver } = router.query

  // navigate to home if addresses are invalid
  useEffect(() => {
    if (
      sender &&
      (typeof sender !== "string" || !isAddress(sender)) &&
      receiver &&
      (typeof receiver !== "string" || !isAddress(receiver)) &&
      router
    ) {
      router.push("/");
    }
  }, [receiver, router, sender]);

  return (
    <AppLayout>
      {sender ? (
        typeof sender === "string" &&  typeof receiver === "string" && <ChatMessages mode={ChatMode.WATCH} sender={sender} receiver={receiver} />
      ) : (
        <div className="h-full w-full flex items-center justify-center flex-col gap-10 sm:w-4/6 md:w-4/6 lg:w-3/6 xl:w-2/6">
          <FontAwesomeIcon
            icon={faCircleExclamation}
            width={100}
            height={100}
          ></FontAwesomeIcon>
          <p className="text-center font-bold font-xl">
            Please connect wallet to see messages
          </p>
        </div>
      )}
    </AppLayout>
  );
};

export default Chat;
