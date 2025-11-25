<script lang="ts">
    import { onMount } from "svelte";

    interface Props {
        onSave: (keys: ApiKeys) => void;
        onClose: () => void;
    }

    interface ApiKeys {
        coinmarketcap: string;
        etherscan: string;
        bscscan: string;
        basescan: string;
        arbiscan: string;
        berachainscan: string;
        optimism: string;
    }

    let { onSave, onClose }: Props = $props();

    let keys = $state<ApiKeys>({
        coinmarketcap: "",
        etherscan: "",
        bscscan: "",
        basescan: "",
        arbiscan: "",
        berachainscan: "",
        optimism: "",
    });

    onMount(() => {
        // Load saved keys from localStorage
        const saved = localStorage.getItem("apiKeys");
        if (saved) {
            try {
                keys = JSON.parse(saved);
            } catch (e) {
                console.error("Failed to load saved API keys");
            }
        }
    });

    function handleSave() {
        // Save to localStorage
        localStorage.setItem("apiKeys", JSON.stringify(keys));
        onSave(keys);
        onClose();
    }

    function handleClear() {
        keys = {
            coinmarketcap: "",
            etherscan: "",
            bscscan: "",
            basescan: "",
            arbiscan: "",
            berachainscan: "",
            optimism: "",
        };
    }
</script>

<div class="modal-overlay" onclick={onClose}>
    <div class="modal-content" onclick={(e) => e.stopPropagation()}>
        <div class="modal-header">
            <h2>⚙️ API Key Settings</h2>
            <button class="close-button" onclick={onClose}>✕</button>
        </div>

        <div class="modal-body">
            <p class="description">
                Configure your own API keys to avoid rate limits. Keys are
                stored locally in your browser.
            </p>

            <div class="key-section">
                <h3>CoinMarketCap API Key</h3>
                <input
                    type="password"
                    bind:value={keys.coinmarketcap}
                    placeholder="Enter your CoinMarketCap API key"
                />
                <a
                    href="https://pro.coinmarketcap.com/signup"
                    target="_blank"
                    class="help-link">Get API Key →</a
                >
            </div>

            <div class="key-section">
                <h3>Blockchain Explorer API Keys</h3>

                <div class="input-group">
                    <label>Ethereum (Etherscan)</label>
                    <input
                        type="password"
                        bind:value={keys.etherscan}
                        placeholder="Etherscan API key"
                    />
                    <a
                        href="https://etherscan.io/apis"
                        target="_blank"
                        class="help-link">Get Key →</a
                    >
                </div>

                <div class="input-group">
                    <label>BNB Chain (BscScan)</label>
                    <input
                        type="password"
                        bind:value={keys.bscscan}
                        placeholder="BscScan API key"
                    />
                    <a
                        href="https://bscscan.com/apis"
                        target="_blank"
                        class="help-link">Get Key →</a
                    >
                </div>

                <div class="input-group">
                    <label>Base (BaseScan)</label>
                    <input
                        type="password"
                        bind:value={keys.basescan}
                        placeholder="BaseScan API key"
                    />
                    <a
                        href="https://basescan.org/apis"
                        target="_blank"
                        class="help-link">Get Key →</a
                    >
                </div>

                <div class="input-group">
                    <label>Arbitrum (Arbiscan)</label>
                    <input
                        type="password"
                        bind:value={keys.arbiscan}
                        placeholder="Arbiscan API key"
                    />
                    <a
                        href="https://arbiscan.io/apis"
                        target="_blank"
                        class="help-link">Get Key →</a
                    >
                </div>

                <div class="input-group">
                    <label>Berachain</label>
                    <input
                        type="password"
                        bind:value={keys.berachainscan}
                        placeholder="Berachain API key"
                    />
                </div>

                <div class="input-group">
                    <label>Optimism</label>
                    <input
                        type="password"
                        bind:value={keys.optimism}
                        placeholder="Optimism API key"
                    />
                    <a
                        href="https://optimistic.etherscan.io/apis"
                        target="_blank"
                        class="help-link">Get Key →</a
                    >
                </div>
            </div>
        </div>

        <div class="modal-footer">
            <button class="button secondary" onclick={handleClear}
                >Clear All</button
            >
            <div class="button-group">
                <button class="button secondary" onclick={onClose}
                    >Cancel</button
                >
                <button class="button primary" onclick={handleSave}
                    >Save Keys</button
                >
            </div>
        </div>
    </div>
</div>

<style>
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 1rem;
    }

    .modal-content {
        background: var(--surface);
        border-radius: 16px;
        max-width: 600px;
        width: 100%;
        max-height: 90vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.5rem;
        border-bottom: 1px solid var(--border);
    }

    .modal-header h2 {
        margin: 0;
        font-size: 1.5rem;
        color: var(--text-primary);
    }

    .close-button {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text-secondary);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        transition: all 0.2s;
    }

    .close-button:hover {
        background: var(--border);
        color: var(--text-primary);
    }

    .modal-body {
        padding: 1.5rem;
        overflow-y: auto;
        flex: 1;
    }

    .description {
        color: var(--text-secondary);
        margin-bottom: 1.5rem;
        font-size: 0.875rem;
    }

    .key-section {
        margin-bottom: 2rem;
    }

    .key-section h3 {
        font-size: 1rem;
        margin-bottom: 1rem;
        color: var(--text-primary);
    }

    .input-group {
        margin-bottom: 1rem;
    }

    .input-group label {
        display: block;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-secondary);
        margin-bottom: 0.5rem;
    }

    input[type="password"] {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid var(--border);
        border-radius: 8px;
        background: var(--background);
        color: var(--text-primary);
        font-size: 0.875rem;
        font-family: monospace;
        transition: all 0.2s;
    }

    input[type="password"]:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .help-link {
        display: inline-block;
        margin-top: 0.25rem;
        font-size: 0.75rem;
        color: var(--primary);
        text-decoration: none;
        transition: opacity 0.2s;
    }

    .help-link:hover {
        opacity: 0.8;
        text-decoration: underline;
    }

    .modal-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.5rem;
        border-top: 1px solid var(--border);
    }

    .button-group {
        display: flex;
        gap: 0.75rem;
    }

    .button {
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
        font-family: inherit;
    }

    .button.primary {
        background: var(--primary);
        color: white;
    }

    .button.primary:hover {
        background: var(--primary-dark);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }

    .button.secondary {
        background: var(--border);
        color: var(--text-primary);
    }

    .button.secondary:hover {
        background: var(--text-tertiary);
    }

    @media (max-width: 640px) {
        .modal-content {
            max-height: 95vh;
        }

        .modal-footer {
            flex-direction: column;
            gap: 0.75rem;
        }

        .button-group {
            width: 100%;
        }

        .button {
            flex: 1;
        }
    }
</style>
