/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '*.aljazeera.com'
        },
        {
          protocol: 'https',
          hostname: '*.cnn.com'
        },
        {
          protocol: 'https',
          hostname: '*.abcnews.go.com'
        },
        {
          protocol: 'https',
          hostname: '*.cbsnews.com'
        },
        {
          protocol: 'https',
          hostname: '*.nbcnews.com'
        },
        {
          protocol: 'https',
          hostname: '*.bbc.co.uk'
        },
        {
          protocol: 'https',
          hostname: '*.reuters.com'
        },
        {
          protocol: 'https',
          hostname: '*.washingtonpost.com'
        },
        {
          protocol: 'https',
          hostname: '*.nytimes.com'
        },
        {
          protocol: 'https',
          hostname: '*.apnews.com'
        },
        {
          protocol: 'https',
          hostname: '*.whitehouse.gov'
        },
        {
          protocol: 'https',
          hostname: 'whitehouse.gov'
        },
        {
          protocol: 'https',
          hostname: '*.wsj.com'
        },
        {
          protocol: 'https',
          hostname: '*.yahoo.com'
        },
        {
          protocol: 'https',
          hostname: '*.time.com'
        },
        {
          protocol: 'https',
          hostname: 'time.com'
        },
        {
          protocol: 'https',
          hostname: '*.npr.org'
        },
        {
          protocol: 'https',
          hostname: 'npr.org'
        },
        {
          protocol: 'https',
          hostname: 'media.npr.org'
        }
      ]
    }
  }
  
  module.exports = nextConfig