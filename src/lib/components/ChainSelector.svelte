<script lang="ts">
    import type { ChainConfig } from "$lib/types/chains";
    import { getAllChains } from "$lib/config/chains";

    interface Props {
        selectedChain: ChainConfig;
        onChainChange: (chain: ChainConfig) => void;
    }

    let { selectedChain, onChainChange }: Props = $props();

    const chains = getAllChains();
</script>

<div class="chain-selector">
    <label for="chain-select">Select Blockchain</label>
    <div class="chain-buttons">
        {#each chains as chain}
            <button
                class="chain-button"
                class:active={selectedChain.chainId === chain.chainId}
                onclick={() => onChainChange(chain)}
            >
                <span class="chain-name">{chain.name}</span>
                <span class="chain-token">{chain.nativeToken}</span>
            </button>
        {/each}
    </div>
</div>

<style>
    .chain-selector {
        width: 100%;
    }

    label {
        display: block;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-secondary);
        margin-bottom: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .chain-buttons {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 0.75rem;
    }

    .chain-button {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
        padding: 1rem 0.75rem;
        background: var(--surface);
        border: 2px solid var(--border);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-family: inherit;
    }

    .chain-button::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 0;
        background: var(--primary);
        border-radius: 10px 0 0 10px;
        transition: width 0.3s ease;
    }

    .chain-button::after {
        content: "✓";
        position: absolute;
        top: 8px;
        right: 8px;
        width: 24px;
        height: 24px;
        background: #10b981;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.875rem;
        font-weight: bold;
        opacity: 0;
        transform: scale(0) rotate(-45deg);
        transition: all 0.3s ease;
        z-index: 1;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .chain-button:hover {
        border-color: var(--primary);
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(99, 102, 241, 0.2);
    }

    .chain-button.active {
        background: linear-gradient(135deg, #6366f1, #4f46e5);
        border-color: #6366f1;
        border-width: 3px;
        color: white;
        box-shadow:
            0 0 0 6px rgba(99, 102, 241, 0.2),
            0 8px 24px rgba(99, 102, 241, 0.6),
            0 2px 8px rgba(0, 0, 0, 0.3);
        transform: translateY(-4px) scale(1.05);
        animation: active-pulse 1.5s ease-in-out infinite;
    }

    .chain-button.active::before {
        width: 6px;
    }

    .chain-button.active::after {
        opacity: 1;
        transform: scale(1) rotate(0deg);
    }

    @keyframes active-pulse {
        0%,
        100% {
            box-shadow:
                0 0 0 6px rgba(99, 102, 241, 0.2),
                0 8px 24px rgba(99, 102, 241, 0.6),
                0 2px 8px rgba(0, 0, 0, 0.3);
        }
        50% {
            box-shadow:
                0 0 0 10px rgba(99, 102, 241, 0.3),
                0 12px 32px rgba(99, 102, 241, 0.7),
                0 2px 8px rgba(0, 0, 0, 0.3);
        }
    }

    .chain-name {
        font-size: 0.875rem;
        font-weight: 600;
    }

    .chain-token {
        font-size: 0.75rem;
        opacity: 0.8;
        font-weight: 500;
    }

    @media (max-width: 640px) {
        .chain-buttons {
            grid-template-columns: repeat(2, 1fr);
        }
    }
</style>
