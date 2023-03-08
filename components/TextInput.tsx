import React, { FunctionComponent } from "react";
import InputEmoji from "react-input-emoji";

import { faArrowCircleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface TextInputProps {
  className?: string;
}

export const TextInput: FunctionComponent<TextInputProps> = ({ className }) => {
  return (
    <div
      className={`${className} flex flex-row items-center p-3 rounded-b-3xl`}
    >
      <InputEmoji
        theme="light"
        type="text"
        className="w-full border focus:bg-gray-100 rounded-3xl px-4 py-2 focus:border-2 focus:border-black focus:outline-none"
        placeholder="Text Message"
      ></InputEmoji>
      <FontAwesomeIcon
        className="h-8 text-gray-400"
        icon={faArrowCircleUp}
      ></FontAwesomeIcon>
    </div>
  );
};
