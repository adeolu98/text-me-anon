import Jazzicon from "@raugfer/jazzicon";

export function buildDataUrl(addr: string): string {
    return (
      "data:image/svg+xml;base64," +
      btoa(Jazzicon(addr))
    );
  }

