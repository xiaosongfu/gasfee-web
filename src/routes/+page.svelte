<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import ChainSelector from "$lib/components/ChainSelector.svelte";
    import GasInput from "$lib/components/GasInput.svelte";
    import ResultsDisplay from "$lib/components/ResultsDisplay.svelte";
    import RefreshButton from "$lib/components/RefreshButton.svelte";
    import ApiKeySettings from "$lib/components/ApiKeySettings.svelte";
    import { gasCalculatorService } from "$lib/services/gasCalculator";
    import type { UserApiKeys } from "$lib/services/gasCalculator";
    import { SUPPORTED_CHAINS } from "$lib/config/chains";
    import type { ChainConfig } from "$lib/types/chains";
    import type { CalculationResult } from "$lib/types/chains";

    let selectedChain = $state<ChainConfig>(SUPPORTED_CHAINS.ethereum);
    let gasAmount = $state<number>(5705753);
    let result = $state<CalculationResult | null>(null);
    let loading = $state<boolean>(false);
    let currentGasPrice = $state<number>(0);
    let autoRefreshInterval: number | null = null;
    let showSettings = $state<boolean>(false);

    async function calculateGasFee() {
        if (gasAmount <= 0) {
            result = null;
            return;
        }

        loading = true;
        try {
            const calculationResult =
                await gasCalculatorService.calculateGasFee(
                    selectedChain,
                    gasAmount,
                );
            result = calculationResult;
            currentGasPrice = calculationResult.gasPrice;
        } catch (error) {
            console.error("Error calculating gas fee in page:", error);
            // Keep previous result on error
        } finally {
            loading = false;
        }
    }

    function handleChainChange(chain: ChainConfig) {
        selectedChain = chain;
        calculateGasFee();
    }

    function handleGasAmountChange(value: number) {
        gasAmount = value;
        calculateGasFee();
    }

    function handleRefresh() {
        calculateGasFee();
    }

    onMount(() => {
        // Load API keys from localStorage
        const saved = localStorage.getItem("apiKeys");
        if (saved) {
            try {
                const keys = JSON.parse(saved);
                gasCalculatorService.setApiKeys(keys);
            } catch (e) {
                console.error("Failed to load saved API keys");
            }
        }

        // Initial calculation
        calculateGasFee();

        // Set up auto-refresh every 12 seconds
        autoRefreshInterval = window.setInterval(() => {
            calculateGasFee();
        }, 12000);
    });

    function handleApiKeysSave(keys: UserApiKeys) {
        gasCalculatorService.setApiKeys(keys);
        // Refresh data with new keys
        calculateGasFee();
    }

    onDestroy(() => {
        if (autoRefreshInterval) {
            clearInterval(autoRefreshInterval);
        }
    });
</script>

<svelte:head>
    <title>EVM Gas Fee Calculator</title>
    <meta
        name="description"
        content="Calculate gas fees in USD for Ethereum, BNB, Base, Arbitrum, Berachain, and Optimism"
    />
</svelte:head>

<div class="app">
    <header class="header">
        <div class="container">
            <div class="header-content">
                <div class="header-left">
                    <h1 class="title">
                        <span class="title-icon">⛽</span>
                        EVM Gas Fee Calculator
                    </h1>
                    <p class="subtitle">
                        Real-time gas fee calculations across multiple chains
                    </p>
                </div>
                <button
                    class="settings-button"
                    onclick={() => (showSettings = true)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path
                            d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
                        />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                    <span>API Keys</span>
                </button>
            </div>
        </div>
    </header>

    <main class="main">
        <div class="container">
            <div class="calculator-card">
                <div class="card-section">
                    <ChainSelector
                        {selectedChain}
                        onChainChange={handleChainChange}
                    />
                </div>

                <div class="card-section">
                    <GasInput
                        value={gasAmount}
                        onValueChange={handleGasAmountChange}
                    />
                </div>

                <div class="card-section">
                    <ResultsDisplay
                        {result}
                        {loading}
                        gasPrice={currentGasPrice}
                    />
                </div>

                <div class="card-section actions">
                    <RefreshButton onRefresh={handleRefresh} {loading} />
                    <div class="auto-refresh-indicator">
                        <span class="pulse-dot"></span>
                        Auto-refresh every 12 seconds
                    </div>
                </div>
            </div>

            <div class="info-cards">
                <div class="info-card">
                    <h3>📊 Real-time Pricing</h3>
                    <p>Gas prices fetched from official blockchain explorers</p>
                </div>
                <div class="info-card">
                    <h3>💱 Accurate Conversion</h3>
                    <p>Token prices from CoinMarketCap API</p>
                </div>
                <div class="info-card">
                    <h3>🔄 Auto-refresh</h3>
                    <p>Prices update automatically every 12 seconds</p>
                </div>
            </div>
        </div>
    </main>

    <footer class="footer">
        <div class="container">
            <p>
                Supported chains: Ethereum • BNB Chain • Base • Arbitrum •
                Berachain • Optimism
            </p>
        </div>
    </footer>
</div>

{#if showSettings}
    <ApiKeySettings
        onSave={handleApiKeysSave}
        onClose={() => (showSettings = false)}
    />
{/if}

<style>
    .app {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }

    .container {
        max-width: var(--container-max-width);
        margin: 0 auto;
        padding: 0 1.5rem;
        width: 100%;
    }

    .header {
        padding: 3rem 0 2rem;
        background: linear-gradient(
            135deg,
            var(--primary) 0%,
            var(--primary-dark) 100%
        );
        color: white;
        position: relative;
        overflow: hidden;
    }

    .header::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        opacity: 0.5;
    }

    .header-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 2rem;
        position: relative;
    }

    .header-left {
        flex: 1;
    }

    .settings-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.25rem;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        color: white;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: inherit;
    }

    .settings-button:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .settings-button svg {
        flex-shrink: 0;
    }

    .title {
        font-size: 2.5rem;
        font-weight: 800;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        position: relative;
    }

    .title-icon {
        font-size: 2rem;
    }

    .subtitle {
        font-size: 1.125rem;
        opacity: 0.9;
        position: relative;
    }

    .main {
        flex: 1;
        padding: 3rem 0;
    }

    .calculator-card {
        background: var(--surface);
        border-radius: 24px;
        padding: 2.5rem;
        box-shadow:
            0 4px 6px rgba(0, 0, 0, 0.05),
            0 10px 20px rgba(0, 0, 0, 0.05);
        border: 1px solid var(--border);
    }

    .card-section {
        padding: 1.5rem 0;
        border-bottom: 1px solid var(--border);
    }

    .card-section:last-child {
        border-bottom: none;
    }

    .card-section.actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .auto-refresh-indicator {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: var(--text-secondary);
    }

    .pulse-dot {
        width: 8px;
        height: 8px;
        background: #10b981;
        border-radius: 50%;
        animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 1;
            transform: scale(1);
        }
        50% {
            opacity: 0.5;
            transform: scale(1.2);
        }
    }

    .info-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-top: 3rem;
    }

    .info-card {
        padding: 2rem;
        background: var(--surface);
        border-radius: 16px;
        border: 1px solid var(--border);
        transition: all 0.2s ease;
    }

    .info-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }

    .info-card h3 {
        font-size: 1.125rem;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
    }

    .info-card p {
        font-size: 0.875rem;
        color: var(--text-secondary);
        line-height: 1.5;
    }

    .footer {
        padding: 2rem 0;
        text-align: center;
        border-top: 1px solid var(--border);
        color: var(--text-secondary);
        font-size: 0.875rem;
    }

    @media (max-width: 768px) {
        .title {
            font-size: 2rem;
        }

        .calculator-card {
            padding: 1.5rem;
        }

        .card-section.actions {
            flex-direction: column;
            align-items: stretch;
        }

        .auto-refresh-indicator {
            justify-content: center;
        }
    }
</style>
