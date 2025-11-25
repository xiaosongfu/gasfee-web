import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async ({ url }) => {
    const symbols = url.searchParams.get('symbols');

    if (!symbols) {
        return json({ error: 'Symbols parameter is required' }, { status: 400 });
    }

    const apiKey = env.COINMARKETCAP_API_KEY;
    if (!apiKey) {
        return json({ error: 'CoinMarketCap API key not configured' }, { status: 500 });
    }

    try {
        const apiUrl = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbols}`;

        const response = await fetch(apiUrl, {
            headers: {
                'X-CMC_PRO_API_KEY': apiKey,
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        if (data.status?.error_code === 0 && data.data) {
            const prices: Record<string, { symbol: string; price: number; timestamp: number }> = {};

            for (const symbol of symbols.split(',')) {
                const tokenData = data.data[symbol];
                if (tokenData && tokenData.quote && tokenData.quote.USD) {
                    prices[symbol] = {
                        symbol,
                        price: tokenData.quote.USD.price,
                        timestamp: Date.now()
                    };
                }
            }

            return json(prices);
        }

        return json({ error: 'Failed to fetch token prices' }, { status: 500 });
    } catch (error) {
        console.error('Error fetching token prices:', error);
        return json({ error: 'Failed to fetch token prices' }, { status: 500 });
    }
};
