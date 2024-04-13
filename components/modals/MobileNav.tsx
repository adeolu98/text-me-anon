import { useModalContext, Modals } from "@/context/modalContext";
import Close from "@/public/close.svg";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { ChatSearch } from "../SearchInput";

function MobileNav() {
  const { active, close } = useModalContext(Modals.MobileNav);

  return active ? (
    <div className="absolute z-10 pt-10 px-8 left-0 right-0 top-0 bottom-0 bg-neutral-50">
      <div className="flex justify-end mb-4">
        <button>
          <Image
            width={20}
            height={20}
            src={Close}
            alt="close-btn"
            onClick={close}
          />
        </button>
      </div>
      <div className="">
        <div className=" my-4">
          <ConnectButton
            showBalance={{
              smallScreen: false,
              largeScreen: true,
            }}
            accountStatus={{
              smallScreen: "full",
              largeScreen: "full",
            }}
          ></ConnectButton>
        </div>
        <ChatSearch></ChatSearch>
      </div>
    </div>
  ) : (
    <div></div>
  );
}

export default MobileNav;
