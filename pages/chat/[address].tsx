import { AppLayout } from "@/components/AppLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { isAddress } from "ethers/lib/utils.js";
import ChatMessages from "@/components/ChatMessages";
import { ChatMode } from "@/lib/types";
import { NoConnect } from "@/components/NoConnect";

const Chat: NextPage = () => {
  const router = useRouter();
  const { address } = useAccount();

  const toAddress = Array.isArray(router.query.address)
    ? router.query.address[0].toLowerCase()
    : router.query.address!;

  // navigate to home if address is invalid
  useEffect(() => {
    if (toAddress && !isAddress(toAddress) && router) {
      router.push("/");
    }
  }, [router, toAddress]);

  return (
    <AppLayout>
      {address ? (
        <ChatMessages
          mode={ChatMode.CHAT}
          sender={address}
          receiver={toAddress}
        />
      ) : (
        <NoConnect></NoConnect>
      )}
    </AppLayout>
  );
};

export default Chat;
