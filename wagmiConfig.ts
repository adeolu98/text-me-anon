import { http, createConfig } from '@wagmi/core'
import { polygon, optimism, mainnet, sepolia, base } from '@wagmi/core/chains'

export const config = createConfig({
  chains: [/**base,*/ polygon, optimism, mainnet, sepolia],
  transports: {
    //[base.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

  