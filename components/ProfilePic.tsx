import React, { FunctionComponent } from "react";

interface ProfilePicProps {
  profilePic?: string;
  className?: string;
}

export const ProfilePic: FunctionComponent<ProfilePicProps> = ({
  className,
  profilePic,
}) => {
  return (
    <div className={`${className}`}>
      <img
        className="w-full"
        object-fit="contain"
        alt="profile-pic"
        src={profilePic ? profilePic : "/profilePlaceholderPic.svg"}
      ></img>
    </div>
  );
};
