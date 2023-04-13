import { AppLayout } from "@/components/AppLayout";
import { NextPage } from "next";
import ReactGA from "react-ga";
import ChatList, { ChatMode } from "@/components/ChatList";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { isAddress } from "ethers/lib/utils.js";

ReactGA.initialize("UA-262892775-1");

const Home: NextPage = () => {
  const router = useRouter()
  const {address} = router.query;

  useEffect(() => {
    if (address && (typeof address !== "string" || !isAddress(address)) && router) {
      router.push("/");
    }
  }, [address, router]);

  return (
    <AppLayout>
      <ChatList mode={ChatMode.WATCH} address={address as string} />
    </AppLayout>
  );
};

export default Home;