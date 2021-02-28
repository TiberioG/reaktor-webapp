const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = app => {
  app.use(
    '/v2/*',
    createProxyMiddleware({
      target: 'https://bad-api-assignment.reaktor.com',
      changeOrigin: true,
    }),
  );
};
