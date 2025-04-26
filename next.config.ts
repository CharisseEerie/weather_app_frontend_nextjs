/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/weather',
          destination: 'http://0.0.0.0:8000/api/weather',   // internal address
        },
      ];
    },
  };
  
  export default nextConfig;
  