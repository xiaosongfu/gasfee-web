import type { GasPriceData, TokenPriceData, CalculationResult } from '$lib/types/chains';
import type { ChainConfig } from '$lib/types/chains';

export class GasCalculatorService {
    async fetchGasPrice(chainId: string): Promise<GasPriceData> {
        const response = await fetch(`/api/gas-price?chain=${chainId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch gas price');
        }
        return response.json();
    }

    async fetchTokenPrice(symbol: string): Promise<TokenPriceData> {
        const response = await fetch(`/api/token-price?symbols=${symbol}`);
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
