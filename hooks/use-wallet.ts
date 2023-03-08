
import { BigNumber, providers } from 'ethers';
import { useCallback, useEffect } from 'react';
import WalletConnectProvider from '@walletconnect/web3-provider';

import { useAppDispatch, useAppSelector } from '@/store';
import { chainCurrency, etherscanUrl, isNetworkSupported, Network, networkNames, rpcBaseURl, rpcUrls } from '@/lib/network';
import { selectUser, connect as connectAction, setAppNetwork, setWalletNetwork, setAddress, disconnect } from '@/store/slice/user';


const walletConnectProvider = new WalletConnectProvider({
  rpc: rpcUrls,
});


export function useWallet() {
  const { mode, address, provider, signer, appNetwork, walletNetwork } =
    useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  // setup listeners
  useEffect(() => {
    if (!provider) return;

    (provider.provider as any).on('chainChanged', async (chainId: unknown) => {
      const walletNetwork = BigNumber.from(chainId).toNumber();
      console.log('wallet: chainChanged: walletNetwork', walletNetwork);
      dispatch(setWalletNetwork({ walletNetwork }));

      const supported = isNetworkSupported(walletNetwork);
      if (supported) {
        console.log('wallet: chainChanged: appNetwork', walletNetwork);
        dispatch(setAppNetwork({ appNetwork: walletNetwork }));
      }
    });

    (provider.provider as any).on('accountsChanged', (accounts: string[]) => {
      const [address] = accounts;
      if (!address) {
        console.log('wallet: account changed: remove address & signer');
        dispatch(disconnect());
      } else {
        dispatch(setAddress({ address }));
      }
    });

    // delete listeners
    return () => {
      if (!provider) return;
      provider.removeAllListeners();
    };
  }, [dispatch, provider]);

  const connect = useCallback(
    async (mode: 'MetaMask' | 'WalletConnect') => {

      let walletAddress: string | undefined;
      let walletProvider: providers.Web3Provider | undefined;

      if (mode === 'MetaMask') {
        if (!(window as any).ethereum) {
          console.log('no metamask installed!');
          return 'no metamask';
        }

        const accounts = await (window as any).ethereum?.request({
          method: 'eth_requestAccounts',
        });
        walletAddress = accounts[0];
        console.log('MetaMask', walletAddress);
        walletProvider = new providers.Web3Provider(
          (window as any).ethereum,
          'any'
        );
      } else if (mode === 'WalletConnect') {
        try {
          const accounts = await walletConnectProvider.enable();
          walletAddress = accounts[0];
          console.log('WalletConnect', walletAddress);
          walletProvider = new providers.Web3Provider(walletConnectProvider);
        } catch (err) {
          console.warn(err);
        }
        return;
      }

      if (!walletProvider || !walletAddress) return;

      const signer = walletProvider.getSigner();
      const { chainId } = await walletProvider.getNetwork();
      const walletNetwork = BigNumber.from(chainId).toNumber();
      dispatch(
        connectAction({
          mode,
          address: walletAddress,
          provider: walletProvider,
          signer,
          walletNetwork,
        })
      );

      const supported = isNetworkSupported(walletNetwork);
      if (supported) {
        dispatch(setAppNetwork({ appNetwork: walletNetwork }));
      }
    },
    [address, dispatch]
  );

  const logout = useCallback(() => dispatch(disconnect()), [ dispatch ]);

  const switchAppNetwork = useCallback(
    async (newNetwork: Network) => {
      // if network is supported, ask metamask to switch
      //  - if metamask says ok, effectively update appNetwork
      //  - else don't update appNetwork
      // else do nothing/throw an error, this shouldn't happen
      if (!provider || !provider.provider.isMetaMask) return;

      const supported = isNetworkSupported(newNetwork);
      if (supported) {
        try {
          const chainId = `0x${newNetwork.toString(16)}`;
          console.log('new chain id');

          await provider.provider.request!({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId }],
          });
          console.log('wallet: switchAppNetwork: appNetwork & walletNetwork');
          dispatch(setWalletNetwork({ walletNetwork: newNetwork }));
          dispatch(setAppNetwork({ appNetwork: newNetwork }));
        } catch (error: any) {
          if (error.code === 4902) {
            // MetaMask doesn't recognized this network: ask the user to add it
            const chainId = `0x${newNetwork.toString(16)}`;
            const chainName = networkNames[newNetwork];
            const nativeCurrency = {
              ...chainCurrency[newNetwork],
              decimals: 18,
            };
            const blockExplorerUrls = [etherscanUrl[newNetwork]];
            const rpcUrls = [rpcBaseURl[newNetwork]];
            await (window as any).ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId,
                  chainName,
                  nativeCurrency,
                  blockExplorerUrls,
                  rpcUrls,
                },
              ],
            });
          } else console.warn(error);
        }
      } else {
        throw new Error(
          `Unsupported Network: You tried to switch the app to #${newNetwork}, but this network is not supported.`
        );
      }
    },
    [provider, dispatch]
  );

  const signMessage = useCallback(
    (message: string) => {
      if (!signer)
        throw new Error(
          `Your wallet must be connected in order to sign messages!`
        );

      return signer.signMessage(message);
    },
    [signer]
  );

  const sendTransaction = useCallback(
    (txRequest: providers.TransactionRequest) => {
      if (!signer)
        throw new Error(
          `Your wallet must be connected in order to send transactions!`
        );

      return signer.sendTransaction(txRequest);
    },
    [signer]
  );

  const getTransaction = useCallback(
    (txHash: string) => {
      if (!provider)
        throw new Error(
          `Your wallet must be connected in order to fetch transaction data!`
        );

      return provider.getTransactionReceipt(txHash);
    },
    [provider]
  );

  const resolveAddress = useCallback(
    (ensName: string) => {
      return provider?.resolveName(ensName);
    },
    [provider]
  );

  return {
    mode,
    address,
    appNetwork,
    walletNetwork,
    provider,
    signer,
    connect,
    logout,
    switchAppNetwork,
    signMessage,
    sendTransaction,
    getTransaction,
    resolveAddress,
  };
}
