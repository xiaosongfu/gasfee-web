import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async ({ url, request }) => {
    const chainId = url.searchParams.get('chain');

    if (!chainId) {
        return json({ error: 'Chain parameter is required' }, { status: 400 });
    }

    // Try to get user-provided API key from header, fallback to server env
    const userApiKey = request.headers.get(`x-etherscan-api-key`);
    const apiKey = userApiKey || env['ETHERSCAN_API_KEY'];

    if (!apiKey) {
        return json({ error: 'API key not configured for this chain' }, { status: 500 });
    }

    try {
        // https://api.etherscan.io/v2/api?chainid=1&module=gastracker&action=gasoracle
        // https://api.etherscan.io/v2/api?chainid=324&module=gastracker&action=gasoracle&apikey=1W6UNEYEZ4217QQE8JVR6M95ZRGC9STYA4
        const apiUrl = `https://api.etherscan.io/v2/api?chainid=${chainId}&module=gastracker&action=gasoracle&apikey=${apiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        // {
        //     "status": "1",
        //     "message": "OK-Missing/Invalid API Key, rate limit of 1/5sec applied",
        //     "result": {
        //         "LastBlock": "23876239",
        //         "SafeGasPrice": "0.717326924",
        //         "ProposeGasPrice": "0.717385674",
        //         "FastGasPrice": "0.767364453",
        //         "suggestBaseFee": "0.717326924",
        //         "gasUsedRatio": "0.6037257691678,0.314610990008508,0.809505607986745,0.59814719846912,0.432887733891958"
        //     }
        // }
        if (data.status === '1' && data.result) {
            return json({
                safeGasPrice: data.result.SafeGasPrice,
                proposeGasPrice: data.result.ProposeGasPrice,
                fastGasPrice: data.result.FastGasPrice,
                lastBlock: data.result.LastBlock,
                timestamp: Date.now()
            });
        }

        return json({ error: 'Failed to fetch gas price in server' + JSON.stringify(data) }, { status: 500 });
    } catch (error) {
        console.error('Error fetching gas price in server:', error);
        return json({ error: 'Failed to fetch gas price in server' + error }, { status: 500 });
    }
};
