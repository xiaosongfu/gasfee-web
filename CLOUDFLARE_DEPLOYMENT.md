# Cloudflare Pages Build Configuration

## Build Settings
- Build command: `npm run build`
- Build output directory: `.svelte-kit/cloudflare`
- Node version: 18 or higher

## Environment Variables
Add the following environment variables in Cloudflare Pages dashboard:

### Required API Keys
```
ETHERSCAN_API_KEY=your_etherscan_api_key
BSCSCAN_API_KEY=your_bscscan_api_key
BASESCAN_API_KEY=your_basescan_api_key
ARBISCAN_API_KEY=your_arbiscan_api_key
BERACHAINSCAN_API_KEY=your_berachainscan_api_key
OPTIMISM_API_KEY=your_optimism_api_key
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key
```

## Deployment Steps

1. **Connect Repository**
   - Go to Cloudflare Pages dashboard
   - Click "Create a project"
   - Connect your Git repository

2. **Configure Build Settings**
   - Framework preset: `SvelteKit`
   - Build command: `npm run build`
   - Build output directory: `.svelte-kit/cloudflare`
   - Root directory: `/`

3. **Add Environment Variables**
   - Go to Settings > Environment variables
   - Add all the API keys listed above
   - Make sure to add them for both Production and Preview environments

4. **Deploy**
   - Click "Save and Deploy"
   - Cloudflare Pages will automatically build and deploy your site

## Custom Domain (Optional)
- Go to Custom domains
- Add your custom domain
- Follow DNS configuration instructions

## Notes
- The app uses server-side API routes that will run on Cloudflare Workers
- User API keys are stored in browser localStorage and sent via request headers
- Server environment variables are used as fallback when users don't provide their own keys
