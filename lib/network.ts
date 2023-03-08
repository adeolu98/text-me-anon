import { getDefaultProvider } from "ethers";

export const networks = [1] as const;
export type Network = typeof networks[number];

export const DEFAULT_NETWORK: Network = 1;

export const networkNames: Record<Network, string> = {
   1: 'Ethereum',
  // 3: 'Ropsten',
  // 4: 'Rinkeby',
  // 5: 'Goerli',
  //56: "BSC",
  // 97: 'BSC Testnet',
  // 137: 'Polygon Mainnet',
  // 80001: 'Mumbai Testnet',
  // 43113: 'Avalanche Fuji',
  // 43114: 'Avalanche C-Chain',
};

export const networkLogo: Record<Network, string> = {
   1: '/logo/eth-logo-gray.svg',
  // 3: '/logo/eth-logo-green.svg',
  // 4: '/logo/eth-logo-blue.svg',
  // 5: '/logo/eth-logo-gray.svg',
 // 56: "/logo/eth-logo-gray.svg", // TODO use BSC logo instead
  // 137: '/logo/polygon-logo.svg',
  // 80001: '/logo/polygon-logo.svg',
  // 43113: '/logo/avalanche-logo.svg',
  // 43114: '/logo/avalanche-logo.svg',
};

export const chainCurrency: Record<Network, { name: string; symbol: string }> =
  {
     1: { name: 'Ethereum', symbol: 'Ethereum' },
    // 3: { name: 'Ropsten', symbol: 'RopstenETH' },
    // 4: { name: 'Rinkeby', symbol: 'RinkebyETH' },
    // 5: { name: 'Goerli', symbol: 'GoerliETH' },
    //56: { name: "Binance Coin", symbol: "BNB" },
    // 97: { name: 'Testnet Binance Coin', symbol: 'TBNB' },
    // 137: { name: 'Polygon Mainnet', symbol: 'MATIC' },
    // 80001: { name: 'Mumbai Testnet', symbol: 'MATIC' },
    // 43113: { name: 'Testnet Avalanche', symbol: 'AVAX' },
    // 43114: { name: 'Avalanche', symbol: 'AVAX' },
  };

export const alchemyApiKeys: Record<Network, string> = {
   1: process.env.NEXT_PUBLIC_ETHEREUM_MAINNET_ALCHEMY_API_KEY!,
  // 3: process.env.NEXT_PUBLIC_ROPSTEN_ALCHEMY_API_KEY!,
  // 4: process.env.NEXT_PUBLIC_RINKEBY_ALCHEMY_API_KEY!,
  // 5: process.env.NEXT_PUBLIC_GOERLI_TESTNET_ALCHEMY_API_KEY!,
  //56: "not-needed",
  // 137: process.env.NEXT_PUBLIC_POLYGON_MAINNET_ALCHEMY_API_KEY!,
  // 80001: process.env.NEXT_PUBLIC_POLYGON_TESTNET_ALCHEMY_API_KEY!,
  // 43113: process.env.NEXT_PUBLIC_AVAX_TESTNET_API_KEY!,
  // 43114: process.env.NEXT_PUBLIC_AVAX_MAINNET_API_KEY!,
};

export const rpcBaseURl: Record<Network, string> = {
   1: 'https://eth-mainnet.g.alchemy.com/',
  // 3: 'https://eth-ropsten.alchemyapi.io/',
  // 4: 'https://eth-rinkeby.alchemyapi.io/',
  // 5: 'https://eth-goerli.g.alchemy.com/',
  //56: "not-needed",
  // 137: 'https://polygon-mainnet.g.alchemy.com/',
  // 80001: 'https://polygon-mumbai.g.alchemy.com/',
  // 43113: 'https://rpc.ankr.com/avalanche_fuji',
  // 43114: 'https://rpc.ankr.com/avalanche',
};

export const rpcUrls: Record<Network, string> = {
  1: `${rpcBaseURl[1]}v2/${alchemyApiKeys[1]}`,
  // 3: `${rpcBaseURl[3]}v2/${alchemyApiKeys[3]}`,
  // 4: `${rpcBaseURl[4]}v2/${alchemyApiKeys[4]}`,
  // 5: `${rpcBaseURl[5]}v2/${alchemyApiKeys[5]}`,
  //56: 'https://bsc-dataseed1.binance.org',
  //56: "https://rpc.ankr.com/bsc",
  // 137: `${rpcBaseURl[137]}v2/${alchemyApiKeys[137]}`,
  // 80001: `${rpcBaseURl[80001]}v2/${alchemyApiKeys[80001]}`,
  // 43113: `${rpcBaseURl[43113]}`,
  // 43114: `${rpcBaseURl[43114]}`,

  // 56: 'https://bsc-dataseed1.binance.org',
  // 97: 'https://data-seed-prebsc-1-s1.binance.org:8545',
};

export const etherscanUrl: Record<Network, string> = {
  1: 'https://etherscan.io',
  // 3: 'https://ropsten.etherscan.io',
  // 4: 'https://rinkeby.etherscan.io',
  // 5: 'https://goerli.etherscan.io',
  //56: "https://bscscan.com",
  // 97: 'https://testnet.bscscan.com',
  // 137: 'https://polygonscan.com',
  // 80001: 'https://mumbai.polygonscan.com',
  // 43113: '',
  // 43114: '',
};

const etherscanTxUrl: Record<Network, string> = {
   1: 'https://etherscan.io/tx/${hash}',
  // 3: 'https://ropsten.etherscan.io/tx/${hash}',
  // 4: 'https://rinkeby.etherscan.io/tx/${hash}',
  // 5: 'https://goerli.etherscan.io/tx/${hash}',
  //56: "https://bscscan.com/tx/${hash}",
  // 97: 'https://testnet.bscscan.com/tx/${hash}',
  // 137: 'https://polygonscan.com/tx/${hash}',
  // 80001: 'https://mumbai.polygonscan.com/tx/${hash}',
  // 43113: '',
  // 43114: '',
};

const etherscanAddressUrl: Record<Network, string> = {
  1: 'https://etherscan.io/address/${address}',
  // 3: 'https://ropsten.etherscan.io/address/${address}',
  // 4: 'https://rinkeby.etherscan.io/address/${address}',
  // 5: 'https://goerli.etherscan.io/address/${address}',
  //56: "https://bscscan.com/address/${address}",
  // 97: 'https://testnet.bscscan.com/address/${address}',
  // 137: 'https://polygonscan.com/address/${address}',
  // 80001: 'https://mumbai.polygonscan.com/address/${address}',
  // 43113: '',
  // 43114: '',
};

export const etherscanEndpointUrl: Record<Network, string> = {
  1: 'https://api.etherscan.io',
  // 3: 'https://api-ropsten.etherscan.io',
  // 4: 'https://api-rinkeby.etherscan.io',
  // 5: 'https://api-goerli.etherscan.io',
  // 56: "https://api.bscscan.com",
  // 137: 'https://api.polygonscan.com',
  // 80001: 'https://api-testnet.polygonscan.com/',
  // 43114: '',
  // 43113: '',
};

export const etherscanApiKeys: Record<Network, string> = {
  1: process.env.NEXT_PUBLIC_ETHEREUM_MAINNET_ETHERSCAN_API_KEY!,
  // 3: '',
  // 4: '',
  // 5: process.env.NEXT_PUBLIC_GOERLI_TESTNET_ETHERSCAN_API_KEY!,
  // 56: process.env.NEXT_PUBLIC_BSC_MAINNET_ETHERSCAN_API_KEY!,
  // 137: process.env.NEXT_PUBLIC_POLYGON_MAINNET_ETHERSCAN_API_KEY!,
  // 80001: process.env.NEXT_PUBLIC_POLYGON_TESTNET_ETHERSCAN_API_KEY!,
  // 43113: '',
  // 43114: '',
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
