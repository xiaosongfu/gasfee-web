<script lang="ts">
    import type { CalculationResult } from "$lib/types/chains";
    import {
        formatCurrency,
        formatGasPrice,
        formatRelativeTime,
    } from "$lib/utils/formatters";

    interface Props {
        result: CalculationResult | null;
        loading: boolean;
        gasPrice: number;
    }

    let { result, loading, gasPrice }: Props = $props();
</script>

<div class="results-display">
    {#if loading}
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Fetching latest prices...</p>
        </div>
    {:else if result}
        <div class="results-grid">
            <div class="result-card primary">
                <div class="result-label">Total Cost</div>
                <div class="result-value large">
                    {formatCurrency(result.totalCostUSD)}
                </div>
            </div>

            <div class="result-card">
                <div class="result-label">Gas Price</div>
                <div class="result-value">{formatGasPrice(gasPrice)}</div>
            </div>

            <div class="result-card">
                <div class="result-label">{result.tokenName} Price</div>
                <div class="result-value">
                    {formatCurrency(result.tokenPrice)}
                </div>
            </div>

            <div class="result-card">
                <div class="result-label">Gas Amount</div>
                <div class="result-value">
                    {result.gasAmount.toLocaleString()}
                </div>
            </div>
        </div>

        <div class="last-updated">
            Last updated: {formatRelativeTime(result.timestamp)}
        </div>
    {:else}
        <div class="empty-state">
            <p>Enter a gas amount to calculate the cost</p>
        </div>
    {/if}
</div>

<style>
    .results-display {
        width: 100%;
        min-height: 200px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .loading-state,
    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem 1rem;
        color: var(--text-secondary);
        gap: 1rem;
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid var(--border);
        border-top-color: var(--primary);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .results-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
    }

    .result-card {
        padding: 1.5rem;
        background: var(--surface);
        border: 2px solid var(--border);
        border-radius: 16px;
        transition: all 0.2s ease;
    }

    .result-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .result-card.primary {
        background: linear-gradient(
            135deg,
            var(--primary),
            var(--primary-dark)
        );
        border-color: var(--primary);
        color: white;
        grid-column: 1 / -1;
    }

    .result-label {
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        opacity: 0.8;
        margin-bottom: 0.5rem;
    }

    .result-value {
        font-size: 1.5rem;
        font-weight: 700;
        font-family: "SF Mono", "Monaco", "Inconsolata", "Fira Code", monospace;
        word-break: break-word;
        overflow-wrap: break-word;
        hyphens: auto;
    }

    .result-value.large {
        font-size: 2.5rem;
    }

    .last-updated {
        text-align: center;
        font-size: 0.75rem;
        color: var(--text-tertiary);
        padding: 0.5rem;
    }

    @media (max-width: 640px) {
        .results-grid {
            grid-template-columns: 1fr;
        }

        .result-value.large {
            font-size: 2rem;
        }
    }
</style>
