import { KeyboardEvent } from "react";
import { buildDataUrl } from "@/lib/utils";
import { isAddress } from "ethers/lib/utils.js";
import { useRouter } from "next/router";
import { ChangeEvent, FocusEventHandler, KeyboardEventHandler, useCallback, useMemo, useState } from "react";
import { useEnsName, useEnsAddress } from "wagmi";
import Image from "next/image";

interface SearchInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholderText?: string;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>
  onBlur?: () => void
}

export function ChatSearch ({classNames, placeholder}: {classNames?: string, placeholder?: string}){
  // const {value, onChange, placeholderText, onKeyDown, onFocus, onBlur} = props;
  const [search, setSearch] = useState("");
  const [searchFocus, setSearchFocus] = useState<boolean>(false);

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
  };
  const router = useRouter();

  const {
    data: ensName,
    error: error1,
    status: status1,
  } = useEnsName({
    address: isAddress(search) ? search as `0x{string}` : ("" as `0x{string}`),
    chainId: 1,
  });
  const {
    data: ensAddress,
    error,
    status,
  } = useEnsAddress({
    name: search,
    chainId: 1,
  });

  // resolved ensName or address
  const [name, address] = useMemo((): [
    string | undefined,
    string | undefined
  ] => {
    if (search && ensName) {
      return [ensName, search];
    } else if (search && ensAddress) {
      return [search, ensAddress];
    } else if (isAddress(search)) {
      return [undefined, search];
    } else {
      return [undefined, undefined];
    }
  }, [ensAddress, ensName, search]);

  const watchAddress = useCallback(() => {
    if (address) {
      router.push(`/watch/${address}`);
      setSearch("");
    }
  }, [address, router]);

  const validateKey = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        watchAddress();
      }
    },
    [watchAddress]
  );

  return (
    <div className={`max-w-[500px] ${classNames} relative w-full items-center md:w-96`}>
      <input
        value={search.toLowerCase()}
        type="text"
        className=" w-full border focus:bg-gray-100 rounded-xl px-4 py-2 focus:border-1 focus:border-black focus:outline-none"
        onChange={handleSearchInput}
        placeholder={placeholder || "Enter address to view chat"}
        onKeyDown={validateKey}
        onFocus={() => setSearchFocus(true)}
        onBlur={() => setTimeout(() => setSearchFocus(false), 200)}
      ></input>
      {search && searchFocus && (
        <div className="flex absolute p-2 w-full bg-white rounded-xl bottom-0 translate-y-[115%] items-center cursor-pointer">
          {!name || !address ? (
            <span className="w-full text-center inline-block">No result</span>
          ) : (
            <button
              className="flex w-full items-center bg-neutral-50 p-[5px] rounded-xl"
              onClick={watchAddress}
            >
              <span className="inline-block flex-shrink-0 w-[20px] h-[20px] relative ">
                <Image
                  fill
                  src={buildDataUrl(address)}
                  alt=""
                  className="rounded-full"
                />
              </span>
              &nbsp;&nbsp;
              <span className="overflow truncate">{name || address}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function SearchInput(props: SearchInputProps) {
  const { value, onChange, placeholderText, onKeyDown, onFocus, onBlur } =
    props;

  return (
    <input
      value={value.toLowerCase()}
      type="text"
      className=" w-full border focus:bg-gray-100 rounded-xl px-4 py-2 focus:border-2 focus:border-black focus:outline-none"
      placeholder={placeholderText || "search"}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
    ></input>
  );
}

export default SearchInput;