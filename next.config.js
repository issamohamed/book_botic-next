/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      GROQ_API_KEY: process.env.GROQ_API_KEY,
      EXA_API_KEY: process.env.EXA_API_KEY,
    },
    images: {
      domains: ['*'], // Be more specific in production
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**',
        },
      ],
    },
  }