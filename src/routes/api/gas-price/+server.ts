import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getChainById } from '$lib/config/chains';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async ({ url, request }) => {
    const chainId = url.searchParams.get('chain');

    if (!chainId) {
        return json({ error: 'Chain parameter is required' }, { status: 400 });
    }

    const chainConfig = getChainById(chainId);
    if (!chainConfig) {
        return json({ error: 'Invalid chain' }, { status: 400 });
    }

    // Try to get user-provided API key from header, fallback to server env
    const userApiKey = request.headers.get(`x-${chainConfig.apiKeyEnvVar.toLowerCase()}`);
    const apiKey = userApiKey || env[chainConfig.apiKeyEnvVar];

    if (!apiKey) {
        return json({ error: 'API key not configured for this chain' }, { status: 500 });
    }

    try {
        // For Etherscan v2 API (Ethereum)
        if (chainConfig.id === 'ethereum') {
            const apiUrl = `${chainConfig.gasOracleEndpoint}?chainid=${chainConfig.chainId}&module=gastracker&action=gasoracle&apikey=${apiKey}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.status === '1' && data.result) {
                return json({
                    safeGasPrice: data.result.SafeGasPrice,
                    proposeGasPrice: data.result.ProposeGasPrice,
                    fastGasPrice: data.result.FastGasPrice,
                    lastBlock: data.result.LastBlock,
                    timestamp: Date.now()
                });
            }
        } else {
            // For other chains using standard Etherscan API
            const apiUrl = `${chainConfig.gasOracleEndpoint}?module=gastracker&action=gasoracle&apikey=${apiKey}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.status === '1' && data.result) {
                return json({
                    safeGasPrice: data.result.SafeGasPrice,
                    proposeGasPrice: data.result.ProposeGasPrice,
                    fastGasPrice: data.result.FastGasPrice,
                    lastBlock: data.result.LastBlock,
                    timestamp: Date.now()
                });
            }
        }

        return json({ error: 'Failed to fetch gas price' }, { status: 500 });
    } catch (error) {
        console.error('Error fetching gas price:', error);
        return json({ error: 'Failed to fetch gas price' }, { status: 500 });
    }
};
