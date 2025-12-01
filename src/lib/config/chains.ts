import type { ChainConfig } from '$lib/types/chains';

export const SUPPORTED_CHAINS: Record<string, ChainConfig> = {
    ethereum: {
        name: 'Ethereum',
        chainId: 1,
        nativeToken: 'ETH',
        alchemyNetwork: 'eth-mainnet',
    },
    bnb: {
        name: 'BNB Chain',
        chainId: 56,
        nativeToken: 'BNB',
        alchemyNetwork: 'bnb-mainnet',
    },
    base: {
        name: 'Base',
        chainId: 8453,
        nativeToken: 'ETH',
        alchemyNetwork: 'base-mainnet',
    },
    arbitrum: {
        name: 'Arbitrum',
        chainId: 42161,
        nativeToken: 'ETH',
        alchemyNetwork: 'arb-mainnet',
    },
    berachain: {
        name: 'Berachain',
        chainId: 80084,
        nativeToken: 'BERA',
        alchemyNetwork: 'berachain-mainnet',
    },
    optimism: {
        name: 'Optimism',
        chainId: 10,
        nativeToken: 'ETH',
        alchemyNetwork: 'opt-mainnet',
    },
    polygon: {
        name: 'Polygon',
        chainId: 137,
        nativeToken: 'POL',
        alchemyNetwork: 'polygon-mainnet',
    },
    zksync: {
        name: 'zkSync Era',
        chainId: 324,
        nativeToken: 'ETH',
        alchemyNetwork: 'zksync-mainnet',
    },
    avalanche: {
        name: 'Avalanche',
        chainId: 43114,
        nativeToken: 'AVAX',
        alchemyNetwork: 'avax-mainnet',
    }
};

export const getChainById = (id: string): ChainConfig | undefined => {
    return Object.values(SUPPORTED_CHAINS).find((chain) => chain.chainId === parseInt(id));
};

export const getAllChains = (): ChainConfig[] => {
    return Object.values(SUPPORTED_CHAINS);
};
