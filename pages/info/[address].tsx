import { AppLayout } from "@/components/AppLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { ProfilePic } from "@/components/ProfilePic";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { getEtherscanAddressLink } from "@/lib/network";
import { useWallet } from "@/hooks/use-wallet";

const Info: NextPage = () => {
  const router = useRouter();
  const {appNetwork} = useWallet()
  const address = Array.isArray(router.query.address)
    ? router.query.address[0]
    : router.query.address!;

  return (
    <AppLayout>
      <div className="border shadow-2xl flex flex-col rounded-3xl h-full w-full sm:w-4/6 md:w-4/6 lg:w-3/6 xl:w-2/6">
        <Link href={`/chat/${address}`}>
          <FontAwesomeIcon
            className="absolute  px-1 xs:px-5 mt-4 xs:mt-7 sm:mt-9"
            icon={faChevronLeft}
          ></FontAwesomeIcon>
        </Link>
        <div className="flex flex-col items-center mt-24 px-1 xs:px-5">
          <ProfilePic className="w-3/12"></ProfilePic>
          <p className="font-medium break-all text-center xs:text-base mt-8">{address}</p>
          <a href={`${getEtherscanAddressLink(appNetwork, address)}`} target="blank"  className="font-light hover:underline mt-4"> view on explorer</a>
        </div>
      </div>
    </AppLayout>
  );
};

export default Info;
