export function shorten(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function hex_to_string(hex: string) {
  var str = "";
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}

export function string_to_hex(str: string) {
  var hex = "";
  for (var i = 0, l = str.length; i < l; i++) {
    hex += str.charCodeAt(i).toString(16);
  }
  return hex;
}

export function getTime(timestamp: number) {
  const currentTime = Math.floor(Date.now() / 1000);
  const timePassed = currentTime - timestamp;
  const date = new Date(timestamp * 1000);

  if (date.toDateString() !== new Date(currentTime * 1000).toDateString()) {
    //format is h:m dd/mm/yy
    const minutes = "0" + date.getMinutes();
    const hours = "0" + date.getHours();
    return `${hours.substr(-2)}:${minutes.substr(
      -2
    )} ${date.getDay()}/${date.getMonth()}/${date
      .getFullYear()
      .toString()
      .slice(2)}`;
  } else {
    const hours = "0" + date.getHours();
    const minutes = "0" + date.getMinutes();

    // Will display time in h:m format
    return hours.substr(-2) + ":" + minutes.substr(-2);
  }
}

