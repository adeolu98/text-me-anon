import React, { FunctionComponent } from "react";
import Jazzicon from "@raugfer/jazzicon";
import { useWallet } from "@/hooks/use-wallet";
import Link from "next/link";

interface ProfilePicProps {
  addressForProfileIcon: string;
  className?: string;
}

export const ProfilePic: FunctionComponent<ProfilePicProps> = ({
  addressForProfileIcon,
  className,
}) => {
  const { address } = useWallet();

  // builds an image data url for embedding
  function buildDataUrl(addr: string): string {
    return (
      "data:image/svg+xml;base64," +
      btoa(Jazzicon(addr === "myself" ? address! : addr))
    );
  }
  const imageUrl = addressForProfileIcon ? buildDataUrl(addressForProfileIcon) : '/profilePlaceholderPic.svg';

  return (
    <div className={`${className}`}>
      <Link href ={`/info/${addressForProfileIcon}`}>
        <img
          id="img"
          className="w-full rounded-full"
          object-fit="contain"
          alt="profile-pic"
          src={imageUrl}
        ></img>
      </Link>
    </div>
  );
};
