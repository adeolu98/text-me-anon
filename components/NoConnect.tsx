import React, { FunctionComponent } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

interface NoConnectProps {}

export const NoConnect: FunctionComponent<NoConnectProps> = ({}) => {
  return (
    <div className="h-full w-full place-items-center grid grid-cols mt-56  gap-10 sm:w-4/6 md:w-4/6 lg:w-3/6 xl:w-2/6">
      <FontAwesomeIcon
        icon={faCircleExclamation}
        width={100}
        height={100}
        className=""
      ></FontAwesomeIcon>
      <p className="text-center font-bold font-xl">
        Please connect wallet first
      </p>
    </div>
  );
};
