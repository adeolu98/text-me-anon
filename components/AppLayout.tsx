import React, { FunctionComponent, ReactNode } from "react";

interface AppLayoutProps {
  className?: string;
  children?: ReactNode;
}

export const AppLayout: FunctionComponent<AppLayoutProps> = ({
  className,
  children,
}) => {
  return (
    <div className={`${className} flex w-full justify-center items-center h-screen px-10 pt-20 pb-10`}>
    {children}

    </div>
  );
};
 