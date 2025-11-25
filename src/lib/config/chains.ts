import type { ChainConfig } from '$lib/types/chains';

export const SUPPORTED_CHAINS: Record<string, ChainConfig> = {
    ethereum: {
        id: 'ethereum',
        name: 'Ethereum',
        chainId: 1,
        nativeToken: 'ETH',
        coinMarketCapId: '1027',
        gasOracleEndpoint: 'https://api.etherscan.io/v2/api',
        apiKeyEnvVar: 'ETHERSCAN_API_KEY',
        explorerUrl: 'https://etherscan.io'
    },
    bnb: {
        id: 'bnb',
        name: 'BNB Chain',
        chainId: 56,
        nativeToken: 'BNB',
        coinMarketCapId: '1839',
        gasOracleEndpoint: 'https://api.bscscan.com/api',
        apiKeyEnvVar: 'BSCSCAN_API_KEY',
        explorerUrl: 'https://bscscan.com'
    },
    base: {
        id: 'base',
        name: 'Base',
        chainId: 8453,
        nativeToken: 'ETH',
        coinMarketCapId: '1027',
        gasOracleEndpoint: 'https://api.basescan.org/api',
        apiKeyEnvVar: 'BASESCAN_API_KEY',
        explorerUrl: 'https://basescan.org'
    },
    arbitrum: {
        id: 'arbitrum',
        name: 'Arbitrum',
        chainId: 42161,
        nativeToken: 'ETH',
        coinMarketCapId: '1027',
        gasOracleEndpoint: 'https://api.arbiscan.io/api',
        apiKeyEnvVar: 'ARBISCAN_API_KEY',
        explorerUrl: 'https://arbiscan.io'
    },
    berachain: {
        id: 'berachain',
        name: 'Berachain',
        chainId: 80084,
        nativeToken: 'BERA',
        coinMarketCapId: '29870',
        gasOracleEndpoint: 'https://api.routescan.io/v2/network/testnet/evm/80084/etherscan/api',
        apiKeyEnvVar: 'BERACHAINSCAN_API_KEY',
        explorerUrl: 'https://bartio.beratrail.io'
    },
    optimism: {
        id: 'optimism',
        name: 'Optimism',
        chainId: 10,
        nativeToken: 'ETH',
        coinMarketCapId: '1027',
        gasOracleEndpoint: 'https://api-optimistic.etherscan.io/api',
        apiKeyEnvVar: 'OPTIMISM_API_KEY',
        explorerUrl: 'https://optimistic.etherscan.io'
    }
};

export const getChainById = (id: string): ChainConfig | undefined => {
    return SUPPORTED_CHAINS[id];
};

export const getAllChains = (): ChainConfig[] => {
    return Object.values(SUPPORTED_CHAINS);
};
