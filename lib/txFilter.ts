import { TxResponse } from "./types";

// filters transactions to filter messages from contract calls,
// simple value transfers and contract creations
function txFilter(tx: TxResponse): boolean {
  if (
    // contains tx data
    tx.data.replace(/^0x/, "") &&
    // interacted with an address
    tx.to &&
    // ensures the gas used is equal to the base tx fee + txdata fee
    compareGas(tx)
  ) {
    return true;
  }
  return false;
}

// calculates and compares the gas used with the base gas fee (21000)  and
// transaction data fee (zero byte: 4, non-zero byte: 16)
function compareGas(tx: TxResponse): boolean {
  const data = tx.data.replace(/^0x/, "");
  const zeroMatches = tx.data.matchAll(/00/g);
  let zeroBytes = 0;
  for (const match of Array.from(zeroMatches)) {
    if (match.index! % 2 === 0) {
      zeroBytes += 1;
    }
  }
  const nonZeroGas = (data.length / 2 - zeroBytes) * 16;
  const zeroGas = zeroBytes * 4;

  const gas = zeroGas + nonZeroGas + 21000;
  if (tx.chainId === 42161) {
    return true; // since base gas limit on arbitrum is not predictable it is better to skip the gas calc and always return true
  }
  return String(gas) === tx.gasUsed;
}

export default txFilter;
