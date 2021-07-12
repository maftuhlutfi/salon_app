module.exports = {
    reactStrictMode: true,
    async redirects() {
      return [
        {
          source: '/',
          destination: '/produk',
          permanent: true,
        },
      ]
    },
    env: {
      mysqlHost:'localhost',
      mysqlDb:'salon_app',
      mysqlUsername:'root',
      mysqlPassword:'',
      mysqlPort:3306
    },
    images: {
      domains: [''],
    },
  }