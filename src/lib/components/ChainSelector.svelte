<script lang="ts">
	import type { ChainConfig } from '$lib/types/chains';
	import { getAllChains } from '$lib/config/chains';

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
				class:active={selectedChain.id === chain.id}
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
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		padding: 1rem 0.75rem;
		background: var(--surface);
		border: 2px solid var(--border);
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.2s ease;
		font-family: inherit;
	}

	.chain-button:hover {
		border-color: var(--primary);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
	}

	.chain-button.active {
		background: linear-gradient(135deg, var(--primary), var(--primary-dark));
		border-color: var(--primary);
		color: white;
		box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
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
