import { ethers } from "ethers";
import { BlockTag } from "@ethersproject/abstract-provider";
import { TxResponse } from "./types";
import { Network, etherscanApiKeys } from "./network";
import { isNotContract } from "./isNotContract";

// modified the original getHistory function from etherscan provider
async function getHistory(
  provider: ethers.providers.EtherscanProvider,
  address: string,
  network: Network,
  startBlock?: BlockTag,
  endBlock?: BlockTag
): Promise<TxResponse[]> {
  const params = {
    action: "txlist",
    address: await provider.resolveName(address),
    startblock: startBlock == null ? 0 : startBlock,
    endblock: endBlock == null ? 99999999 : endBlock,
    sort: "asc",
    apikey: etherscanApiKeys[network],
  };

  const res = await provider.fetch("account", params);
  const filtered = await isNotContract(res, network);

  return filtered.map((tx: any) => {
    ["contractAddress", "to"].forEach(function (key) {
      if (tx[key] == "") {
        delete tx[key];
      }
    });
    if (tx.creates == null && tx.contractAddress != null) {
      tx.creates = tx.contractAddress;
    }
    const item = provider.formatter.transactionResponse(tx);
    if (tx.timeStamp) {
      item.timestamp = parseInt(tx.timeStamp);
    }

    return { ...item, gasUsed: tx.gasUsed, chainId: network };
  });
}

export default getHistory;
