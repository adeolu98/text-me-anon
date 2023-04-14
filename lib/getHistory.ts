import { ethers } from "ethers";
import { Network } from "./network";
import {BlockTag } from "@ethersproject/abstract-provider"
import { TxResponse } from "./types";

// modified the original getHistory function from etherscan provider
async function getHistory(provider: ethers.providers.EtherscanProvider, address: string, network: number, startBlock?: BlockTag, endBlock?: BlockTag): Promise<TxResponse[]>{
  const params = {
            action: "txlist",
            address: (await provider.resolveName(address)),
            startblock: ((startBlock == null) ? 0: startBlock),
            endblock: ((endBlock == null) ? 99999999: endBlock),
            sort: "asc"
        };

  const result = await provider.fetch("account", params);

  return result.map((tx: any) => {
    ["contractAddress", "to"].forEach(function(key) {
        if (tx[key] == "") { delete tx[key]; }
    });
    if (tx.creates == null && tx.contractAddress != null) {
        tx.creates = tx.contractAddress;
    }
    const item = provider.formatter.transactionResponse(tx);
    if (tx.timeStamp) { item.timestamp = parseInt(tx.timeStamp); }

    return {...item, gasUsed: tx.gasUsed, chainId: network};
  });
}


export default getHistory;