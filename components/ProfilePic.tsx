import React, { FunctionComponent } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { buildDataUrl } from "@/lib/utils";

interface ProfilePicProps {
  addressForProfileIcon: string;
  className?: string;
}

export const ProfilePic: FunctionComponent<ProfilePicProps> = ({
  addressForProfileIcon,
  className,
}) => {
  const { address } = useAccount();


  const imageUrl = addressForProfileIcon ? buildDataUrl(addressForProfileIcon) : '/profilePlaceholderPic.svg';

  return (
    <div className={`${className}`} title="Click to view more info">
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
