import type { NextConfig } from 'next';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/faqs',
        destination: '/FAQs',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
