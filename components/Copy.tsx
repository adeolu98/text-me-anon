import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

interface CopyProps {
  copyText: string,
  onCopyText: string,
  defaultText: string,
  classNames?: string
}

function Copy({copyText, onCopyText, defaultText, classNames}: CopyProps){
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    window.navigator.clipboard.writeText(
      copyText
    );
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <>
      <div
        className={`hover:underline text-blue-800 cursor-copy text-xs py-2 flex flex-row items-center gap-1 ${classNames}`}
        onClick={handleCopy}
      >
        <p>
          {!copied ? defaultText : onCopyText}
        </p>
        {!copied ? (
          <FontAwesomeIcon
            width={15}
            height={15}
            icon={faLink}
          ></FontAwesomeIcon>
        ) : (
          <FontAwesomeIcon
            width={15}
            height={15}
            icon={faCircleCheck}
          ></FontAwesomeIcon>
        )}
      </div>
    </>
  );
}

export default Copy;