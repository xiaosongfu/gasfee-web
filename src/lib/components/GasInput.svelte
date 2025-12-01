<script lang="ts">
    interface Props {
        value: number;
        onValueChange: (value: number) => void;
    }

    let { value = $bindable(0), onValueChange }: Props = $props();

    function handleInput(e: Event) {
        const target = e.target as HTMLInputElement;
        const newValue = parseInt(target.value) || 0;
        onValueChange(newValue);
    }
</script>

<div class="gas-input">
    <label for="gas-amount">Gas Amount</label>
    <div class="input-wrapper">
        <input
            id="gas-amount"
            type="number"
            min="0"
            step="1"
            {value}
            oninput={handleInput}
            placeholder="Enter gas amount (e.g., 2100)"
        />
        <span class="input-suffix">gas</span>
    </div>
    <p class="input-hint">Enter the amount of gas units for your transaction</p>
</div>

<style>
    .gas-input {
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

    .input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }

    input {
        width: 100%;
        padding: 1rem 4rem 1rem 1.25rem;
        font-size: 1.125rem;
        font-weight: 600;
        background: var(--surface);
        border: 2px solid var(--border);
        border-radius: 12px;
        color: var(--text-primary);
        transition: all 0.2s ease;
        font-family: "SF Mono", "Monaco", "Inconsolata", "Fira Code", monospace;
    }

    input:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    input::placeholder {
        color: var(--text-tertiary);
        font-weight: 400;
    }

    .input-suffix {
        position: absolute;
        right: 1.25rem;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .input-hint {
        margin-top: 0.5rem;
        font-size: 0.75rem;
        color: var(--text-tertiary);
    }

    /* Remove number input arrows */
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    input[type="number"] {
        -moz-appearance: textfield;
    }
</style>
