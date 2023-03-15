import { BigNumber, providers } from "ethers";
import { useCallback, useEffect } from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";

import { useAppDispatch, useAppSelector } from "@/store";
import {
  chainCurrency,
  etherscanUrl,
  isNetworkSupported,
  Network,
  networkNames,
  rpcBaseURl,
  rpcUrls,
} from "@/lib/network";

import { fetchDiscussions, selectDiscussions } from "@/store/slice/discussions";
import { useWallet } from "./use-wallet";
import { DiscussionsState } from "@/lib/types";
import { setInterval } from "timers";

function shouldFetch(discussions: DiscussionsState) {
  return Object.entries(discussions).every((e) => !e[1]);
}

export function useDiscussions() {
  const dispatch = useAppDispatch();
  const discussions = useAppSelector(selectDiscussions);
  const { address, appNetwork } = useWallet();

  useEffect(() => {
    if (!address) return;
    const getData = () => {
      dispatch(fetchDiscussions({ network: appNetwork, userAddress: address }));
     // console.log("discussions", discussions);
    };

    if (shouldFetch(discussions)) {
    setInterval(getData, 2000);
    // dispatch(fetchDiscussions({ network: appNetwork, userAddress: address }));
    }
  }, [dispatch, address, discussions, appNetwork]);

  return discussions;
}

export function useDiscussion(address: string) {
  const discussions = useDiscussions();
  const found = Object.entries(discussions).find(
    ([a]) => address.toLowerCase() === a
  );

  return found?.[1];
}
