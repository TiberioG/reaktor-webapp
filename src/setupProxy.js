const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://bad-api-assignment.reaktor.com',
      changeOrigin: true,
    }),
  );
};
