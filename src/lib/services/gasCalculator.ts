import type { GasPriceData, TokenPriceData, CalculationResult } from '$lib/types/chains';
import type { ChainConfig } from '$lib/types/chains';

export interface UserApiKeys {
    coinmarketcap?: string;
    etherscan?: string;
}

export class GasCalculatorService {
    private apiKeys: UserApiKeys = {};

    setApiKeys(keys: UserApiKeys) {
        this.apiKeys = keys;
    }

    async fetchGasPrice(chainId: number): Promise<GasPriceData> {
        const headers: HeadersInit = {};

        // Add etherscan API key if available
        if (this.apiKeys.etherscan) {
            headers['x-etherscan-api-key'] = this.apiKeys.etherscan;
        }

        const response = await fetch(`/api/gas-price?chain=${chainId}`, { headers });
        if (!response.ok) {
            throw new Error('Failed to fetch gas price in client');
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
            throw new Error('Failed to fetch token price in client');
        }
        const data = await response.json();
        return data[symbol];
    }

    calculateCost(
        gasAmount: number,
        gasPriceGwei: number,
        tokenPriceUSD: number,
        tokenName: string,
    ): CalculationResult {
        // Formula: (gasAmount * gasPriceGwei * tokenPriceUSD) / 1e9
        // gasPriceGwei is already in Gwei, so we divide by 1e9 to convert to ETH/BNB/etc
        const totalCostUSD = (gasAmount * gasPriceGwei * tokenPriceUSD) / 1e9;

        return {
            gasAmount,
            gasPrice: gasPriceGwei,
            tokenPrice: tokenPriceUSD,
            totalCostUSD,
            tokenName: tokenName,
            timestamp: Date.now()
        };
    }

    async calculateGasFee(
        chainConfig: ChainConfig,
        gasAmount: number
    ): Promise<CalculationResult> {
        const [gasPrice, tokenPrice] = await Promise.all([
            this.fetchGasPrice(chainConfig.chainId),
            this.fetchTokenPrice(chainConfig.nativeToken)
        ]);

        console.log("----------------calculateGasFee----------")
        console.log("chainConfig", chainConfig)
        console.log("tokenPrice", tokenPrice)
        console.log("gasPrice", gasPrice)
        console.log("----------------calculateGasFee----------\n")

        // Use proposed gas price as default
        const gasPriceGwei = parseFloat(gasPrice.proposeGasPrice);

        return this.calculateCost(gasAmount, gasPriceGwei, tokenPrice.price, chainConfig.nativeToken);
    }
}

export const gasCalculatorService = new GasCalculatorService();
