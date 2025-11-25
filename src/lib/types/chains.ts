export interface ChainConfig {
	id: string;
	name: string;
	chainId: number;
	nativeToken: string;
	coinMarketCapId: string;
	gasOracleEndpoint: string;
	apiKeyEnvVar: string;
	explorerUrl: string;
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
	tokenPrice: number; // in USD
	totalCostUSD: number;
	chain: string;
	timestamp: number;
}
