import { ChangeEvent, FocusEventHandler, KeyboardEventHandler } from "react";

interface SearchInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholderText?: string;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>
  onBlur?: () => void
}

function SearchInput (props: SearchInputProps){
  const {value, onChange, placeholderText, onKeyDown, onFocus, onBlur} = props;

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