export interface ChainConfig {
	name: string;
	chainId: number;
	nativeToken: string;
	alchemyNetwork?: string;
}

export interface GasPriceData {
	safeGasPrice: string;
	proposeGasPrice: string;
	fastGasPrice: string;
	lastBlock: string;
	timestamp: number;
}

export interface TokenPriceData {
	symbol: string;
	price: number;
	timestamp: number;
}

export interface CalculationResult {
	gasAmount: number;
	gasPrice: number; // in Gwei
	tokenName: string;
	tokenPrice: number; // in USD
	totalCostUSD: number;
	timestamp: number;
}
