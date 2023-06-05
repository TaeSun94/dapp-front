import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { WagmiConfig, createConfig, mainnet, configureChains } from 'wagmi';
import { hardhat } from 'viem/chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

// import { createPublicClient, http, createTestClient } from 'viem';

// const config = createConfig({
//   autoConnect: true,
//   publicClient: createPublicClient({
//     chain: hardhat,
//     transport: http(),
//   }),
// });

// const testClient = createTestClient({
//   chain: hardhat,
//   mode: 'hardhat',
//   transport: http(),
// })

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [hardhat],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: `http://localhost:8545`
      })
    })
  ]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [
    new MetaMaskConnector({
      chains,
    })
  ]
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <Component {...pageProps} />
    </WagmiConfig>
  )
}
