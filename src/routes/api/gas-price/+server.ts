import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { getChainById } from '$lib/config/chains';

export const GET: RequestHandler = async ({ url, request }) => {
    const chainId = url.searchParams.get('chain');

    if (!chainId) {
        return json({ error: 'Chain parameter is required' }, { status: 400 });
    }

    const chainConfig = getChainById(chainId);
    if (!chainConfig || !chainConfig.alchemyNetwork) {
        return json({ error: 'Chain not supported or Alchemy network not configured' }, { status: 400 });
    }

    // Try to get user-provided API key from header, fallback to server env or default
    const userApiKey = request.headers.get(`x-alchemy-api-key`);
    const apiKey = userApiKey || env['ALCHEMY_API_KEY'] || '3gXuij3_Htk8Kyf0VnMv7';

    if (!apiKey) {
        return json({ error: 'API key not configured' }, { status: 500 });
    }

    try {
        const rpcUrl = `https://${chainConfig.alchemyNetwork}.g.alchemy.com/v2/${apiKey}`;
        console.log('Fetching gas price from:', rpcUrl);

        const response = await fetch(rpcUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_gasPrice',
                params: [],
                id: 1
            })
        });

        const data = await response.json();
        console.log('Gas price response:', data);

        if (data.result) {
            const gasPriceWei = parseInt(data.result, 16);
            const gasPriceGwei = gasPriceWei / 1e9;

            // Format to reasonable decimal places (e.g. 9 decimals for precision)
            // User requested full precision, so we use a high number of decimals or just the string
            const formattedGasPrice = gasPriceGwei.toString();

            return json({
                safeGasPrice: formattedGasPrice,
                proposeGasPrice: formattedGasPrice,
                fastGasPrice: formattedGasPrice,
                lastBlock: '0', // Not fetched in this call
                timestamp: Date.now()
            });
        }

        return json({ error: 'Failed to fetch gas price: ' + JSON.stringify(data) }, { status: 500 });
    } catch (error) {
        console.error('Error fetching gas price:', error);
        return json({ error: 'Failed to fetch gas price: ' + error }, { status: 500 });
    }
};
