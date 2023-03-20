import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchDiscussions, selectDiscussions } from "@/store/slice/discussions";
import { useWallet } from "./use-wallet";


export function useDiscussions() {
  const dispatch = useAppDispatch();
  const discussions = useAppSelector(selectDiscussions);
  const { address, appNetwork } = useWallet()
  
  useEffect(() => {
    if (!address) return;
    dispatch(fetchDiscussions({ network: appNetwork, userAddress: address }));

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
