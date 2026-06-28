import type { NextConfig } from 'next';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

// OpenNext requires a Next.js config file and uses this hook to make
// Cloudflare bindings available while running `next dev` locally.
initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {};

export default nextConfig;
