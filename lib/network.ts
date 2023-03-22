export const networks = [1, 137, 42161, 10, 5, 11155111] as const;
export type Network = typeof networks[number];


const etherscanUrl: Record<Network, string> = {
  1: "https://etherscan.io",
  5: "https://goerli.etherscan.io",
  137: "https://polygonscan.com",
  42161: "https://arbiscan.io",
  10: "https://optimistic.etherscan.io",
  11155111: "https://sepolia.etherscan.io",
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
  const url = etherscanUrl[network];
  return url + `/tx/${hash}`;
}

export function getEtherscanAddressLink(network: Network, address: string) {
  const url = etherscanUrl[network];
  return url + `/address/${address}`;
}

