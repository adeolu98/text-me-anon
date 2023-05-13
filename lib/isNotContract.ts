import { EAOChecker_ABI, MULTICALL_ABI } from "./abis";
import { EAOCheckerAddress, Network, getProvider } from "./network";
import { arbitrum } from "wagmi/chains";
import { ethers } from "ethers";

export async function isNotContract(txs: any[], network: Network) {
  //check that the tx.to addresses are not contracts

  if (network === arbitrum.id) {
    let provider = getProvider(arbitrum.id);

    const targets = txs.map(() => {
      return EAOCheckerAddress[network];
    });
    const inputs = txs.map((data, index) => {
      let eaoInterface = new ethers.utils.Interface(EAOChecker_ABI);

      return eaoInterface.encodeFunctionData("isEAO", [
        data.to.length === 42
          ? data.to
          : "0x0000000000000000000000000000000000000000",
      ]);
    });

    const multiCallContractAddr = "0x3fc2721bc8425320b13f19544d2820fa5755c2f6";
    const multiCallInstance = new ethers.Contract(
      multiCallContractAddr,
      MULTICALL_ABI,
      provider
    );

    const results = await multiCallInstance.multiCall(targets, inputs);
    //where 0x0000000000000000000000000000000000000000000000000000000000000001 === true 
    //and 0x0000000000000000000000000000000000000000000000000000000000000000 === false
    return txs.filter(
      (data, index) =>
        results[index] ===
        "0x0000000000000000000000000000000000000000000000000000000000000001"
    );
  } else {
    //this check logic only on arbitrum for now, will do the rest later
    return txs;
  }
}
