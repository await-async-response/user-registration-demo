import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  // TypeORM/mysql2 use dynamic requires that Turbopack/webpack can't statically
  // bundle, so they must run as real Node requires instead of being bundled.
  serverExternalPackages: ['typeorm', 'mysql2'],
  // Ensure the tracer still copies them into the standalone output.
  outputFileTracingIncludes: {
    '/**/*': ['./node_modules/mysql2/**/*', './node_modules/typeorm/**/*'],
  },
}

export default nextConfig
