import "@/styles/globals.css";
import "@/styles/index.css";
import type { AppProps } from "next/app";
import store from '@/store';
import { Provider as ReduxProvider } from "react-redux";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider store={store}>
      <Component {...pageProps} />
    </ReduxProvider>
  );
}
