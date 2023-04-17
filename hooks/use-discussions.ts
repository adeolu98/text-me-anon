import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchDiscussions, resetDiscussions, selectDiscussions } from "@/store/slice/discussions";
import { useAccount, useEnsAddress, useNetwork } from "wagmi";
import { DiscussionsState, FetchStatus } from "@/lib/types";

let localDiscussion: DiscussionsState;

function shouldFetch(discussions: DiscussionsState) {
  //should only fetch if there's new update
  return !(localDiscussion === discussions);
}

export function useDiscussions(sender?: string) {
  const dispatch = useAppDispatch();
  let discussions = useAppSelector(selectDiscussions);

  useEffect(() => {
    if (!sender) return;
    if (shouldFetch(discussions) && discussions[sender]?.fetchStatus !== FetchStatus.PENDING) {
      dispatch(fetchDiscussions({ address: sender }));
      localDiscussion = discussions;
    }
  }, [sender, dispatch, discussions]);

  return { discussions: discussions[sender || ""]?.discussions, 
    fetchStatus: discussions[sender || ""]?.fetchStatus, 
    loaded: discussions[sender || ""]?.loaded 
  }; 
}

export function useDiscussion(receiver: string, sender?: string,) {
  const { discussions, fetchStatus, loaded } = useDiscussions(sender);
  const found = Object.entries(discussions || []).find(
    ([a]) => receiver.toLowerCase() === a
  );

  return {discussion: found?.[1], fetchStatus, loaded};
}
