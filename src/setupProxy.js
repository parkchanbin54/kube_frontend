const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = (app) => {
	// auth 포함 하위 route에 대해서는 localhost:5000/v1을 domain으로 하여 proxy설정
  app.use(
		'/api',
		createProxyMiddleware({
			target: 'http://backend-service',
			changeOrigin: true,
		}))
	// dummy 포함 하위 route에 대해서는 localhost:6000/v1을 domain으로 하여 proxy설정
  app.use(
		'/chat',
		createProxyMiddleware({
			target: 'http://backend-service',
			changeOrigin: true,
		}))
    
}
