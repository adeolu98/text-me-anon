import { AppLayout } from "@/components/AppLayout";
import { NextPage } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation, faLink } from "@fortawesome/free-solid-svg-icons";
import { useAccount, useEnsName } from "wagmi";
import ReactGA from "react-ga";
import ChatList from "@/components/ChatList";
import { ChatMode } from "@/lib/types";
import LandingPage from "@/components/LandingPage";

ReactGA.initialize("UA-262892775-1");

const Home: NextPage = () => {
  const { address } = useAccount();
  const { data } = useEnsName({
    address: `0x${address?.slice(2) as string}`,
    chainId: 1,
  });

  return (
    <AppLayout>
      {address ? (
        <ChatList
          ensNameForAddress={data}
          mode={ChatMode.CHAT}
          address={address}
        />
      ) : (
        <LandingPage mode={ChatMode.CHAT}/>
      )}
    </AppLayout>
  );
};

export default Home;
