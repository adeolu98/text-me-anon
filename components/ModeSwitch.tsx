import { ChatMode } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectMode, setMode } from "@/store/slice/general";
import { ChatIcon, ViewIcon } from "@chakra-ui/icons";
import { Switch } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAccount } from "wagmi";

function ModeSwitch() {
  const mode = useAppSelector(selectMode);
  const dispatch = useAppDispatch();
  const { push, basePath, asPath, pathname } = useRouter();
  const { isConnected } = useAccount();
  const _setMode = (mode: ChatMode) => {
    dispatch(setMode(mode));
    if (mode === ChatMode.CHAT) {
      push("/");
    } else {
      push("/watch");
    }
  };

  useEffect(() => {
    console.log(mode);
    if (mode !== undefined) return;
    if (pathname.startsWith("/watch")) {
      dispatch(setMode(ChatMode.WATCH));
    } else if (
      pathname.startsWith("/chat") ||
      pathname === "/" ||
      pathname.startsWith("/new-message")
    ) {
      dispatch(setMode(ChatMode.CHAT));
    } else if (isConnected) {
      dispatch(setMode(ChatMode.CHAT));
    } else {
      dispatch(setMode(ChatMode.WATCH));
    }
  }, [isConnected, pathname, mode]);

  return (
    <div>
      <button title="Chat mode" onClick={() => _setMode(ChatMode.CHAT)}>
        <ChatIcon color={mode === ChatMode.CHAT ? "#0E76FD" : "#CBD5E0"} />
      </button>
      &nbsp;&nbsp;
      <Switch
        isChecked={mode === ChatMode.WATCH}
        id="mode-switch"
        colorScheme="blackAlpha"
        color="blue"
        onChange={() =>
          _setMode(mode === ChatMode.CHAT ? ChatMode.WATCH : ChatMode.CHAT)
        }
      />
      &nbsp;&nbsp;
      <button title="Watch mode" onClick={() => _setMode(ChatMode.WATCH)}>
        <ViewIcon color={mode === ChatMode.WATCH ? "#0E76FD" : "#CBD5E0"} />
      </button>
    </div>
  );
}

export default ModeSwitch;
