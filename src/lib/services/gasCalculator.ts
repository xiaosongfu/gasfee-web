import type { GasPriceData, TokenPriceData, CalculationResult } from '$lib/types/chains';
import type { ChainConfig } from '$lib/types/chains';

export interface UserApiKeys {
    coinmarketcap?: string;
    etherscan?: string;
    bscscan?: string;
    basescan?: string;
    arbiscan?: string;
    berachainscan?: string;
    optimism?: string;
    polygonscan?: string;
    zksync?: string;
    snowtrace?: string;
}

export class GasCalculatorService {
    private apiKeys: UserApiKeys = {};

    setApiKeys(keys: UserApiKeys) {
        this.apiKeys = keys;
    }

    async fetchGasPrice(chainId: string): Promise<GasPriceData> {
        const headers: HeadersInit = {};

        // Add user API key to headers based on chain
        const keyMap: Record<string, keyof UserApiKeys> = {
            ethereum: 'etherscan',
            bnb: 'bscscan',
            base: 'basescan',
            arbitrum: 'arbiscan',
            berachain: 'berachainscan',
            optimism: 'optimism',
            polygon: 'polygonscan',
            zksync: 'zksync',
            avalanche: 'snowtrace'
        };

        const keyName = keyMap[chainId];
        if (keyName && this.apiKeys[keyName]) {
            headers[`x-${keyName}_api_key`] = this.apiKeys[keyName]!;
        }

        const response = await fetch(`/api/gas-price?chain=${chainId}`, { headers });
        if (!response.ok) {
            throw new Error('Failed to fetch gas price');
        }
        return response.json();
    }

    async fetchTokenPrice(symbol: string): Promise<TokenPriceData> {
        const headers: HeadersInit = {};

        // Add CoinMarketCap API key if available
        if (this.apiKeys.coinmarketcap) {
            headers['x-coinmarketcap-api-key'] = this.apiKeys.coinmarketcap;
        }

        const response = await fetch(`/api/token-price?symbols=${symbol}`, { headers });
        if (!response.ok) {
            throw new Error('Failed to fetch token price');
        }
        const data = await response.json();
        return data[symbol];
    }

    calculateCost(
        gasAmount: number,
        gasPriceGwei: number,
        tokenPriceUSD: number,
        chain: ChainConfig
    ): CalculationResult {
        // Formula: (gasAmount * gasPriceGwei * tokenPriceUSD) / 1e9
        // gasPriceGwei is already in Gwei, so we divide by 1e9 to convert to ETH/BNB/etc
        const totalCostUSD = (gasAmount * gasPriceGwei * tokenPriceUSD) / 1e9;

        return {
            gasAmount,
            gasPrice: gasPriceGwei,
            tokenPrice: tokenPriceUSD,
            totalCostUSD,
            chain: chain.name,
            timestamp: Date.now()
        };
    }

    async calculateGasFee(
        chainConfig: ChainConfig,
        gasAmount: number
    ): Promise<CalculationResult> {
        const [gasPrice, tokenPrice] = await Promise.all([
            this.fetchGasPrice(chainConfig.id),
            this.fetchTokenPrice(chainConfig.nativeToken)
        ]);

        // Use proposed gas price as default
        const gasPriceGwei = parseFloat(gasPrice.proposeGasPrice);

        return this.calculateCost(gasAmount, gasPriceGwei, tokenPrice.price, chainConfig);
    }
}

export const gasCalculatorService = new GasCalculatorService();
