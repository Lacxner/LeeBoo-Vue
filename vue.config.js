let proxyObject = {}

// 定义Node.js代理对象
proxyObject['/'] = {
    ws: false,
    target: 'http://localhost:8080',
    changeOrigin: true,
    pathRewrite: {
        '^/': ''
    }
}

module.exports = {
    devServer: {
        host: 'localhost',
        port: 3000,
        proxy: proxyObject
    }
}