import { useWallet } from "@/hooks/use-wallet";
import { providers } from "ethers";
import { DEFAULT_NETWORK, Network } from "./network";

export function shorten(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function hex_to_string(hex: string) {
  var str = "";
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}

export function string_to_hex(str: string) {
  var hex = "";
  for (var i = 0, l = str.length; i < l; i++) {
    hex += str.charCodeAt(i).toString(16);
  }
  return hex;
}

export function getTime(timestamp: number) {
  const currentTime = Math.floor(Date.now() / 1000);
  const timePassed = currentTime - timestamp;
  const date = new Date(timestamp * 1000);

  if (date.toDateString() !== new Date(currentTime * 1000).toDateString()) {
    //format is h:m dd/mm/yy
    const minutes = "0" + date.getMinutes();
    return `${date.getHours()}:${minutes.substr(
      -2
    )} ${date.getDay()}/${date.getMonth()}/${date
      .getFullYear()
      .toString()
      .slice(2)}`;
  } else {
    const hours = "0" + date.getHours();
    const minutes = "0" + date.getMinutes();

    // Will display time in h:m format
    return hours.substr(-2) + ":" + minutes.substr(-2);
  }
}

//ens functions
export async function getEnsName(
  address: string,
  appNetwork: Network,
  provider?: providers.Web3Provider
) {
  if (appNetwork !== DEFAULT_NETWORK) return;
  if (address && address.length !== 42) return;

  try {
    const ens = await provider?.lookupAddress(address);
    if (ens !== null) return ens;
    if (ens === null) return;
  } catch (error) {
    console.error();
  }
}

export async function resolveEnsName(
  ensName: string,
  appNetwork: Network,
  provider?: providers.Web3Provider
) {
  if (appNetwork !== DEFAULT_NETWORK) return;

  try {
    const address = await provider?.resolveName(ensName);
    console.log("resolve", address);

    if (address !== null) return address;
    if (address === null) return;
  } catch (error) {
    console.error();
  }
}
