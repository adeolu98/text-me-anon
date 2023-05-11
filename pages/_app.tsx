import "@/styles/globals.css";
import "@/styles/index.css";
import type { AppProps } from "next/app";
import store from "@/store";
import { Provider as ReduxProvider } from "react-redux";
import { ChakraProvider } from "@chakra-ui/react";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
// import {
//   mainnet,
//   polygon,
//   optimism,
//   arbitrum,
//   goerli,
//   sepolia
// } from "wagmi/chains";
import {
  mainnet,
  polygon,
  optimism,
  goerli,
  sepolia
} from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import React from "react";
import Jazzicon from "@raugfer/jazzicon";
import { AvatarComponent, lightTheme } from "@rainbow-me/rainbowkit";
import Head from "next/head";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import ModalContext from "@/context/modalContext";

const { chains, provider } = configureChains(
  [mainnet, polygon, optimism, goerli, sepolia],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY! }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: false,
  connectors,
  provider,
});

export const customAvatar: AvatarComponent = ({ address, ensImage, size }) => {
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
    <div>
      <img
        id="img"
        className="w-full rounded-full"
        object-fit="contain"
        alt="profile-pic"
        src={imageUrl}
      ></img>
    </div>
  );
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <Head>
        <title>Text-Me Anon</title>
        <link rel="icon" href="/anon.ico"></link>
      </Head>
      <RainbowKitProvider
        modalSize="compact"
        theme={lightTheme()}
        avatar={customAvatar}
        chains={chains}
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
    </WagmiConfig>
  );
}
