export function formatNumber(value: number, decimals: number = 2, maxDecimals?: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: maxDecimals ?? decimals,
  });
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 18, // Show up to 18 decimals for precision
  }).format(value);
}

export function formatGasPrice(value: number): string {
  // Show all decimals for gas price
  return `${formatNumber(value, 0, 18)} Gwei`;
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);

  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export function formatToken(value: number, tokenName: string): string {
  // Show up to 18 decimals for ETH
  return `${formatNumber(value, 0, 18)} ${tokenName}`;
}
