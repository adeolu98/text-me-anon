import "@/styles/globals.css";
import "@/styles/index.css";
import type { AppProps } from "next/app";
import store from "@/store";
import { Provider as ReduxProvider } from "react-redux";
import { ChakraProvider } from "@chakra-ui/react";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, base, sepolia } from "wagmi/chains";
import React from "react";
import Jazzicon from "@raugfer/jazzicon";
import { AvatarComponent, lightTheme } from "@rainbow-me/rainbowkit";
import Head from "next/head";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import ModalContext from "@/context/modalContext";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [/**base,*/ polygon, optimism, mainnet, sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const client = new QueryClient();

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
    <WagmiProvider reconnectOnMount={false} config={config}>
      <QueryClientProvider client={client}>
        <Head>
          <title>Text-Me Anon</title>
          <link rel="icon" href="/anon.ico"></link>
        </Head>
        <RainbowKitProvider
          modalSize="compact"
          theme={lightTheme()}
          avatar={customAvatar}
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
