import { getEnsName, resolveEnsName } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useWallet } from "./use-wallet";

export function useLookUpENS(address: string) {
  const [ens, setEns] = useState<string | undefined>();
  const { appNetwork, provider } = useWallet();

  useEffect(() => {
    const init = async () => {
      const ensName = await getEnsName(address, appNetwork, provider);
      setEns(ensName);
    };
    init();
  }, [address, appNetwork, provider]);

  return ens;
}

export function useResolveENS(ensName: string) {
    const [resolvedAddr, setResolvedAddr] = useState<string | undefined>();
    const { appNetwork, provider } = useWallet();
  
    useEffect(() => {
      const init = async () => {
        const res = await resolveEnsName(ensName, appNetwork, provider);
        setResolvedAddr(res);
      };
      init();
    }, [ensName, appNetwork, provider]);
  
    return resolvedAddr;
  }