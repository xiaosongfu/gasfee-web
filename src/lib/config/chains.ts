import type { ChainConfig } from '$lib/types/chains';

export const SUPPORTED_CHAINS: Record<string, ChainConfig> = {
    ethereum: {
        name: 'Ethereum',
        chainId: 1,
        nativeToken: 'ETH',
    },
    bnb: {
        name: 'BNB Chain',
        chainId: 56,
        nativeToken: 'BNB',
    },
    base: {
        name: 'Base',
        chainId: 8453,
        nativeToken: 'ETH',
    },
    arbitrum: {
        name: 'Arbitrum',
        chainId: 42161,
        nativeToken: 'ETH',
    },
    berachain: {
        name: 'Berachain <暂不支持>',
        chainId: 80084,
        nativeToken: 'BERA',
    },
    optimism: {
        name: 'Optimism',
        chainId: 10,
        nativeToken: 'ETH',
    },
    polygon: {
        name: 'Polygon',
        chainId: 137,
        nativeToken: 'POL',
    },
    zksync: {
        name: 'zkSync Era',
        chainId: 324,
        nativeToken: 'ETH',
    },
    avalanche: {
        name: 'Avalanche',
        chainId: 43114,
        nativeToken: 'AVAX',
    }
};

export const getChainById = (id: string): ChainConfig | undefined => {
    return SUPPORTED_CHAINS[id];
};

export const getAllChains = (): ChainConfig[] => {
    return Object.values(SUPPORTED_CHAINS);
};
