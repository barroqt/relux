/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
    webpack: (
        config,
        { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
    ) => {
        config.externals.push('pino-pretty', 'lokijs', 'encoding')

        /*
        // Remove Cache
        if (config.cache && !dev) {
            config.cache = Object.freeze({
                type: 'memory',
            })
            config.cache.maxMemoryGenerations = 0
        }*/

        // Important: return the modified config
        return config
    },
    productionBrowserSourceMaps: false,
}

module.exports = nextConfig
