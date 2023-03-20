import { getDefaultProvider } from "ethers";

export const networks = [1, 137, 42161, 10, 5, 11155111] as const;
export type Network = typeof networks[number];

export const DEFAULT_NETWORK: Network = 1;

export const networkNames: Record<Network, string> = {
  1: "Ethereum",
  137: "Polygon Mainnet",
  42161: "Arbitrum One",
  10: "Optimism",
  5: "Goerli",
  11155111: "Sepolia",
};

export const networkLogo: Record<Network, string> = {
  1: "/logo/eth.svg",
  137: "/logo/polygon.svg",
  42161: "/logo/arbitrum.svg",
  10: "/logo/optimism.svg",
  5: "/logo/eth.svg",
  11155111: "/logo/eth.svg",
};

export const chainCurrency: Record<Network, { name: string; symbol: string }> =
  {
    1: { name: "Ethereum", symbol: "Ethereum" },
    5: { name: 'Goerli', symbol: 'GoerliETH' },
    137: { name: "Polygon Mainnet", symbol: "MATIC" },
    42161:{ name: "Arbitrum One", symbol: "ArbETH" },
    10: { name: "Optimism", symbol: "OpETH" },
    11155111: { name: "Sepolia", symbol: "SepoliaETH" }
  };

export const alchemyApiKeys: Record<Network, string> = {
  1: process.env.NEXT_PUBLIC_ETHEREUM_MAINNET_ALCHEMY_API_KEY!,
  5: process.env.NEXT_PUBLIC_GOERLI_TESTNET_ALCHEMY_API_KEY!,
  137: process.env.NEXT_PUBLIC_POLYGON_MAINNET_ALCHEMY_API_KEY!,
  42161: process.env.NEXT_PUBLIC_ARBITRUM_ALCHEMY_API_KEY!,
  10: process.env.NEXT_PUBLIC_OPTIMISM_ALCHEMY_API_KEY!,
  11155111: process.env.NEXT_PUBLIC_SEPOLIA_ALCHEMY_API_KEY!,
};

export const rpcBaseURl: Record<Network, string> = {
  1: "https://eth-mainnet.g.alchemy.com/",
   5: 'https://eth-goerli.g.alchemy.com/',
  // 56:   "https://rpc.ankr.com/bsc",
  137: "https://polygon-mainnet.g.alchemy.com/",
  42161:"",
  10: "",
  11155111: "",
};

export const rpcUrls: Record<Network, string> = {
  1: `${rpcBaseURl[1]}v2/${alchemyApiKeys[1]}`,
  5: `${rpcBaseURl[5]}v2/${alchemyApiKeys[5]}`,
  137: `${rpcBaseURl[137]}v2/${alchemyApiKeys[137]}`,
  42161: `${rpcBaseURl[42161]}v2/${alchemyApiKeys[42161]}`,
  10: `${rpcBaseURl[10]}v2/${alchemyApiKeys[10]}`,
  11155111: `${rpcBaseURl[11155111]}v2/${alchemyApiKeys[11155111]}`,
};

export const etherscanUrl: Record<Network, string> = {
  1: "https://etherscan.io",
   5: 'https://goerli.etherscan.io',
  137: "https://polygonscan.com",
  42161: "",
  10: "",
  11155111: "",
};

export const etherscanProviderSupportedNetworks: Record<Network, string> = {
  1: "homestead",
  137: "matic",
  42161 : 'arbitrum',
  10  : 'optimism',
  5: 'goerli',
  11155111 :'sepolia',
};

const etherscanTxUrl: Record<Network, string> = {
  1: "https://etherscan.io/tx/${hash}",
  5: 'https://goerli.etherscan.io/tx/${hash}',
  137: "https://polygonscan.com/tx/${hash}",
  42161: "",
  10: "",
  11155111: "",
};

const etherscanAddressUrl: Record<Network, string> = {
  1: "https://etherscan.io/address/${address}",
  5: 'https://goerli.etherscan.io/address/${address}',
  137: "https://polygonscan.com/address/${address}",
  42161: "",
  10: "",
  11155111: "",
};

export const etherscanEndpointUrl: Record<Network, string> = {
  1: "https://api.etherscan.io",
  5: 'https://api-goerli.etherscan.io',
  137: "https://api.polygonscan.com",
  42161: "",
  10: "",
  11155111: "",
};

export const etherscanApiKeys: Record<Network, string> = {
  1: process.env.NEXT_PUBLIC_ETHEREUM_MAINNET_ETHERSCAN_API_KEY!,
  5: process.env.NEXT_PUBLIC_GOERLI_TESTNET_ETHERSCAN_API_KEY!,
  137: process.env.NEXT_PUBLIC_POLYGON_MAINNET_ETHERSCAN_API_KEY!,
  42161: process.env.NEXT_PUBLIC_ARBITRUM_MAINNET_ETHERSCAN_API_KEY!,
  10: process.env.NEXT_PUBLIC_OPTIMISM_MAINNET_ETHERSCAN_API_KEY!,
  11155111: process.env.NEXT_PUBLIC_SEPOLIA_TESTNET_ETHERSCAN_API_KEY!,

};

export function isNetworkSupported(chainId: number): chainId is Network {
  return networks.includes(chainId as unknown as Network);
}

export function getEtherscanTxLink(network: Network, hash: string) {
  const url = etherscanTxUrl[network];
  return url.replace("${hash}", hash);
}

export function getEtherscanAddressLink(network: Network, address: string) {
  const url = etherscanAddressUrl[network];
  return url.replace("${address}", address);
}

export function getProvider(network: Network) {
  // avoid silent fallback to eth mainnet, which can cause really hard to debug errors
  const url = rpcUrls[network];
  if (!url)
    throw new Error(
      `MISSING RPC URL: There is no defined rpc url for network ${network}`
    );

  return getDefaultProvider(url);
}
