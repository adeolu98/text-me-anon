import "@/styles/globals.css";
import "@/styles/index.css";
import type { AppProps } from "next/app";
import store from "@/store";
import { Provider as ReduxProvider } from "react-redux";
import { ChakraProvider } from "@chakra-ui/react";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, http } from "wagmi";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

import {
  mainnet,
  polygon,
  optimism,
  zkSync,
  base,
  scroll,
  linea,
  polygonZkEvm,
  sepolia,
} from "viem/chains";
import React from "react";
import Jazzicon from "@raugfer/jazzicon";
import { AvatarComponent, lightTheme } from "@rainbow-me/rainbowkit";
import Head from "next/head";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

import ModalContext from "@/context/modalContext";


const scrollMainnet = {
  //modified to add icon url
  ...scroll,
  iconBackground: "#fff",
  iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/26998.png'
};

const lineaMainnet = {
  //modified to add icon url
  ...linea,
  iconBackground: "#fff",
  iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/27657.png'
};

const polygonZkEvmExtended = {
  ...polygonZkEvm,
  iconBackground: "#fff",
  iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png'
}

const config = getDefaultConfig({
  appName: "Text-Me Anon",
  projectId: "TEXT_ME_ANON",
  chains: [
    mainnet,
    polygon,
    optimism,
    base,
    zkSync,
    scrollMainnet,
    lineaMainnet,
    polygonZkEvmExtended,
    sepolia,
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [base.id]: http(),
    [zkSync.id]: http(),
    [scrollMainnet.id]: http(),
    [lineaMainnet.id]: http(),
    [polygonZkEvmExtended.id]: http(),
    [sepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

export const customAvatar: AvatarComponent = ({ address }) => {
  // builds an image data url for embedding
  function buildDataUrl(addr: string): string {
    return (
      "data:image/svg+xml;base64," +
      btoa(Jazzicon(addr === "myself" ? address! : addr))
    );
  }
  const imageUrl = address
    ? buildDataUrl(address)
    : "/profilePlaceholderPic.svg";

  return (
      <img
        id="img"
        className="w-full rounded-full"
        object-fit="contain"
        alt="profile-pic"
        src={imageUrl}
      ></img>
  );
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Head>
          <title>Text-Me Anon</title>
          <link rel="icon" href="/anon.ico"></link>
        </Head>
          <RainbowKitProvider
            modalSize="compact"
            theme={lightTheme()}
            avatar={customAvatar}
            coolMode
          >
            <ChakraProvider>
              <ReduxProvider store={store}>
                <GoogleAnalytics />
                <ModalContext>
                  <Component {...pageProps} />
                </ModalContext>
              </ReduxProvider>
            </ChakraProvider>
          </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
