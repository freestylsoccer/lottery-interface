/* eslint-disable @typescript-eslint/no-var-requires */
const { withSentryConfig } = require('@sentry/nextjs')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const sentryWebpackPluginOptions =
  process.env.VERCEL_ENV === 'production'
    ? {
        // Additional config options for the Sentry Webpack plugin. Keep in mind that
        // the following options are set automatically, and overriding them is not
        // recommended:
        //   release, url, org, project, authToken, configFile, stripPrefix,
        //   urlPrefix, include, ignore
        silent: false, // Logging when deploying to check if there is any problem
        validate: true,
        // Mark the release as Production
        // https://github.com/getsentry/sentry-webpack-plugin/blob/master/src/index.js#L522
        deploy: {
          env: process.env.VERCEL_ENV,
        },
        // For all available options, see:
        // https://github.com/getsentry/sentry-webpack-plugin#options.
      }
    : {
        silent: true, // Suppresses all logs
        dryRun: !process.env.SENTRY_AUTH_TOKEN,
      }

/** @type {import('next').NextConfig} */
const config = {
  compiler: {
    styledComponents: true,
  },
  experimental: {
    scrollRestoration: true,
  },
  reactStrictMode: true,
  images: {
    domains: ['static-nft.pancakeswap.com'],
  },
  async rewrites() {
    return [
      {
        source: '/info/token/:address',
        destination: '/lottery',
      },
      {
        source: '/info/pool/:address',
        destination: '/lottery',
      },
      {
        source: '/info/pair/:address',
        destination: '/lottery',
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/lottery',
        permanent: true,
      },
      {
        source: '/send',
        destination: '/lottery',
        permanent: true,
      },
      {
        source: '/swap/:outputCurrency',
        destination: '/lottery',
        permanent: true,
      },
      {
        source: '/create/:currency*',
        destination: '/lottery',
        permanent: true,
      },
      {
        source: '/farms/archived',
        destination: '/lottery',
        permanent: true,
      },
      {
        source: '/pool',
        destination: '/lottery',
        permanent: true,
      },
      {
        source: '/staking',
        destination: '/lottery',
        permanent: true,
      },
      {
        source: '/syrup',
        destination: '/lottery',
        permanent: true,
      },
      {
        source: '/collectibles',
        destination: '/lottery',
        permanent: true,
      },
    ]
  },
}

module.exports = withBundleAnalyzer(withSentryConfig(config, sentryWebpackPluginOptions))
