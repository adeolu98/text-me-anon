export const networks = [1, 137, 42161, 10, 5, 11155111] as const;
export type Network = (typeof networks)[number];

import ETHLogo from "@/public/ethereum-eth-logo.svg";
import ArbitrumLogo from "@/public/arbitrum-logo.svg";
import OptimisimLogo from "@/public/optimism-ethereum-op-logo.svg";
import PolygonLogo from "@/public/polygon-matic-logo.svg";
import { EAOChecker_ABI } from "./abis";
import { ethers } from "ethers";

export const etherscanUrl: Record<Network, string> = {
  1: "https://etherscan.io",
  5: "https://goerli.etherscan.io",
  137: "https://polygonscan.com",
  42161: "https://arbiscan.io",
  10: "https://optimistic.etherscan.io",
  11155111: "https://sepolia.etherscan.io",
};

export const networkNames: Record<number, string> = {
  1: "ETH Mainnet",
  5: "Goerli",
  137: "Polygon",
  42161: "Arbitrum",
  10: "Optimism",
  11155111: "Sepolia",
};

export const networkLogos: Record<Network, string> = {
  1: ETHLogo,
  5: ETHLogo,
  137: PolygonLogo,
  42161: ArbitrumLogo,
  10: OptimisimLogo,
  11155111: ETHLogo,
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

export const EAOCheckerAddress: Record<Network, string> = {
  1: "",
  5: "",
  137: "",
  42161: "0xd7D19eE9Ee85f884Ab7502D451c3ef40e6852b1d",
  10: "",
  11155111: "",
};

export const EAOChecker_Instance = (network: Network) => {
  return new ethers.Contract(
    EAOCheckerAddress[network],
    EAOChecker_ABI,
    getProvider(network)
  );
};

export const rpcBaseURl: Record<Network, string> = {
  1: "https://eth-mainnet.g.alchemy.com/",
  5: "https://eth-goerli.g.alchemy.com/",
  137: "https://polygon-mainnet.g.alchemy.com/",
  42161: "https://arb-mainnet.g.alchemy.com/",
  10: "https://opt-mainnet.g.alchemy.com/",
  11155111: "https://eth-sepolia.g.alchemy.com/",
};
////arb-mainnet.g.alchemy.com/v2/IB_LzuOX-JYA8quanGZGoHmxqObAOdJz%7D 

export const rpcUrls: Record<Network, string> = {
  1: `${rpcBaseURl[1]}v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
  5: `${rpcBaseURl[5]}v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
  137: `${rpcBaseURl[137]}v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
  42161: `${rpcBaseURl[42161]}v2/${process.env
    .NEXT_PUBLIC_ARBITRUM_ALCHEMY_API_KEY}`,
  10: `${rpcBaseURl[10]}v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
  11155111: `${rpcBaseURl[11155111]}v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
};

export const getProvider = (network: Network) => {
  return new ethers.providers.JsonRpcProvider(
    rpcUrls[network]
  );
};
