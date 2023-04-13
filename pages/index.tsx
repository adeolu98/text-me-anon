import { AppLayout } from "@/components/AppLayout";
import { NextPage } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation, faLink } from "@fortawesome/free-solid-svg-icons";
import { useAccount } from "wagmi";
import ReactGA from "react-ga";
import ChatList, { ChatMode } from "@/components/ChatList";

ReactGA.initialize("UA-262892775-1");

const Home: NextPage = () => {
  const { address } = useAccount();

  return (
    <AppLayout>
      {address ? <ChatList mode={ChatMode.CHAT} address={address} /> : (
        <div className="h-full w-full flex items-center justify-center flex-col gap-10 sm:w-4/6 md:w-4/6 lg:w-3/6 xl:w-2/6">
          <FontAwesomeIcon
            icon={faCircleExclamation}
            width={100}
            height={100}
          ></FontAwesomeIcon>
          <p className="text-center font-bold font-xl">
            Please connect wallet or search address to see messages
          </p>
        </div>
      )}
    </AppLayout>
  );
};

export default Home;
