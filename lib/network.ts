export const networks = [1, 137, 42161, 10, 5, 11155111] as const;
export type Network = typeof networks[number];


const etherscanTxUrl: Record<Network, string> = {
  1: "https://etherscan.io/tx/${hash}",
  5: "https://goerli.etherscan.io/tx/${hash}",
  137: "https://polygonscan.com/tx/${hash}",
  42161: "https://arbiscan.io/tx/${hash}",
  10: "https://optimistic.etherscan.io/tx/${hash}",
  11155111: "https://sepolia.etherscan.io/tx/${hash}",
};

const etherscanAddressUrl: Record<number, string> = {
  1: "https://etherscan.io/address/${address}",
  5: "https://goerli.etherscan.io/address/${address}",
  137: "https://polygonscan.com/address/${address}",
  42161: "https://arbiscan.io/address/${address}",
  10: "https://optimistic.etherscan.io/address/${address}",
  11155111: "https://sepolia.etherscan.io/address/${address}",
};

export const etherscanApiKeys: Record<Network, string> = {
  1: process.env.NEXT_PUBLIC_ETHEREUM_MAINNET_ETHERSCAN_API_KEY!,
  5: process.env.NEXT_PUBLIC_GOERLI_TESTNET_ETHERSCAN_API_KEY!,
  137: process.env.NEXT_PUBLIC_POLYGON_MAINNET_ETHERSCAN_API_KEY!,
  42161: process.env.NEXT_PUBLIC_ARBITRUM_MAINNET_ETHERSCAN_API_KEY!,
  10: process.env.NEXT_PUBLIC_OPTIMISM_MAINNET_ETHERSCAN_API_KEY!,
  11155111: process.env.NEXT_PUBLIC_SEPOLIA_TESTNET_ETHERSCAN_API_KEY!,
};



export function getEtherscanTxLink(network: Network, hash: string) {
  const url = etherscanTxUrl[network];
  return url.replace("${hash}", hash);
}

export function getEtherscanAddressLink(network: Network, address: string) {
  const url = etherscanAddressUrl[network];
  return url.replace("${address}", address);
}

