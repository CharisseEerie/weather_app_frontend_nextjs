/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
      return [
            {
                    source: '/api/:path*',
                            destination: 'https://super-duper-parakeet-g46wgx4pp9v9hwj7-8000.app.github.dev/api/:path*',
                                  },
                                      ];
                                        },
                                        };
                                        
                                        module.exports = nextConfig;