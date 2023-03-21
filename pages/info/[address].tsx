import { AppLayout } from "@/components/AppLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { ProfilePic } from "@/components/ProfilePic";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { getEtherscanAddressLink } from "@/lib/network";
import { useWallet } from "@/hooks/use-wallet";
import { useLookUpENS } from "@/hooks/use-ens";

const Info: NextPage = () => {
  const router = useRouter();
  const { address, appNetwork } = useWallet();
  const queriedAddress = Array.isArray(router.query.address)
    ? router.query.address[0]
    : router.query.address!;

  const ens = useLookUpENS(queriedAddress);

  return (
    <AppLayout>
      <div className="border shadow-2xl flex flex-col rounded-3xl h-full w-full sm:w-4/6 md:w-4/6 lg:w-3/6 xl:w-2/6">
        <Link href={`/chat/${queriedAddress}`}>
          <FontAwesomeIcon
            className="absolute  px-1 xs:px-5 mt-4 xs:mt-7 sm:mt-9"
            icon={faChevronLeft}
          ></FontAwesomeIcon>
        </Link>
        <div className="flex flex-col items-center mt-24 px-1 xs:px-5">
          <ProfilePic
            addressForProfileIcon={queriedAddress}
            className="w-5/12"
          ></ProfilePic>
          {ens && (
            <p className="font-bold break-all text-center xs:text-base mt-8">
              {ens}
            </p>
          )}
          <p
            className={`font-medium break-all text-center xs:text-base ${
              ens ? "mt-2" : "mt-8"
            } mt-8`}
          >
            {queriedAddress}
          </p>
          <a
            href={
              queriedAddress === "myself" && address
                ? `${getEtherscanAddressLink(appNetwork, address)}`
                : `${getEtherscanAddressLink(appNetwork, queriedAddress)}`
            }
            target="blank"
            className="font-light hover:underline mt-4"
          >
            view on explorer
          </a>
        </div>
      </div>
    </AppLayout>
  );
};

export default Info;
