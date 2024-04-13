import { AppLayout } from "@/components/AppLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { ProfilePic } from "@/components/ProfilePic";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { useEnsName } from "wagmi";
import { isAddress } from "ethers/lib/utils.js";
import { useEffect } from "react";

const Info: NextPage = () => {
  const router = useRouter();
  const queriedAddress = Array.isArray(router.query.address)
    ? router.query.address[0].toLowerCase()
    : router.query.address!?.toLowerCase();

  const { data } = useEnsName({
    address: queriedAddress ? `0x${queriedAddress.slice(2)}` : undefined,
    chainId: 1,
  });

  // navigate to home if address is invalid
  useEffect(() => {
    if (queriedAddress && !isAddress(queriedAddress) && router) {
      router.push("/");
    }
  }, [router, queriedAddress]);

  return (
    <AppLayout>
      <div className="border shadow-2xl flex flex-col rounded-3xl h-full w-full sm:w-4/6 md:w-4/6 lg:w-3/6 xl:w-2/6">
        <FontAwesomeIcon
          className="absolute px-1 xs:px-5 mt-9 cursor-pointer"
          icon={faChevronLeft}
          width={50}
          height={50}
          onClick={router.back}
          title="Go back"
        >
        </FontAwesomeIcon>
        <div className="flex flex-col items-center mt-24 px-1 xs:px-5">
          <ProfilePic
            addressForProfileIcon={queriedAddress}
            className="w-5/12"
          ></ProfilePic>
          {data && (
            <p className="font-bold break-all text-center xs:text-base mt-8">
              {data}
            </p>
          )}
          <p
            className={`font-medium break-all text-center xs:text-base ${
              data ? "mt-2" : "mt-8"
            } mt-8`}
          >
            {queriedAddress}
          </p>
          <a
            href={`https://blockscan.com/address/${queriedAddress}`}
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
