import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchDiscussions, resetDiscussions, selectDiscussions } from "@/store/slice/discussions";
import { useAccount, useEnsAddress, useNetwork } from "wagmi";
import { DiscussionsState } from "@/lib/types";

let localDiscussion: DiscussionsState;

function shouldFetch(discussions: DiscussionsState) {
  //should only fetch if there's new update
  return !(localDiscussion === discussions);
}

export function useDiscussions() {
  const dispatch = useAppDispatch();
  let discussions = useAppSelector(selectDiscussions);
  const { address } = useAccount();
  const { chain } = useNetwork();

  useEffect(() => {
    if (!address) return;

    if (shouldFetch(discussions)) {
     dispatch(fetchDiscussions({ network: chain, userAddress: address }));
     localDiscussion = discussions;
    }
  }, [address, chain, dispatch, discussions]);

  return discussions ;
}

export function useDiscussion(address: string) {
  const discussions = useDiscussions();
  const found = Object.entries(discussions).find(
    ([a]) => address.toLowerCase() === a
  );

  return found?.[1];
}
