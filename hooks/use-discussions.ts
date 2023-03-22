import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchDiscussions, selectDiscussions } from "@/store/slice/discussions";
import { useAccount, useNetwork, useProvider } from "wagmi";


export function useDiscussions() {
  const dispatch = useAppDispatch();
  const discussions = useAppSelector(selectDiscussions);
  const { address } = useAccount();
  const { chain } = useNetwork()
  
  useEffect(() => {
    if (!address) return;
    dispatch(fetchDiscussions({ network: chain, userAddress: address }));
  }, [dispatch, address, discussions, chain]);

  return discussions;
}

export function useDiscussion(address: string) {
  const discussions = useDiscussions();
  const found = Object.entries(discussions).find(
    ([a]) => address.toLowerCase() === a
  );

  return found?.[1];
}
