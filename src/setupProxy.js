const { createProxyMiddleware } = require('http-proxy-middleware');

//used in developement to avoid CORS errors,
//for production setup the server
module.exports = app => {
  app.use(
    '/v2/',
    createProxyMiddleware({
      target: 'https://bad-api-assignment.reaktor.com',
      changeOrigin: true,
    }),
  );
};
