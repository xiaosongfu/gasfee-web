<script lang="ts">
    interface Props {
        onRefresh: () => void;
        loading: boolean;
    }

    let { onRefresh, loading }: Props = $props();
</script>

<button class="refresh-button" onclick={onRefresh} disabled={loading}>
    <svg
        class="refresh-icon"
        class:spinning={loading}
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
            d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"
        />
    </svg>
    <span>{loading ? "Refreshing..." : "Refresh Prices"}</span>
</button>

<style>
    .refresh-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.875rem 1.5rem;
        background: var(--surface);
        border: 2px solid var(--border);
        border-radius: 12px;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-primary);
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: inherit;
    }

    .refresh-button:hover:not(:disabled) {
        border-color: var(--primary);
        background: var(--primary);
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
    }

    .refresh-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .refresh-icon {
        transition: transform 0.3s ease;
    }

    .refresh-icon.spinning {
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>
