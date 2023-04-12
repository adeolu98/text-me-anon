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

export function useDiscussions(sender?: string) {
  const dispatch = useAppDispatch();
  let discussions = useAppSelector(selectDiscussions);
  const { address } = useAccount();
  const { chain } = useNetwork();

  useEffect(() => {
    if (!address) return;

    if (shouldFetch(discussions)) {
     dispatch(fetchDiscussions({ address }));
     localDiscussion = discussions;
    }
  }, [address, chain, dispatch, discussions]);

  return discussions[sender || ""] ;
}

export function useDiscussion(receiver: string, sender?: string,) {
  const discussions = useDiscussions(sender) || [];
  const found = Object.entries(discussions).find(
    ([a]) => receiver.toLowerCase() === a
  );

  return found?.[1];
}
