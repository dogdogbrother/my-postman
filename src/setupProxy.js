const proxy = require('http-proxy-middleware')



module.exports = function(app) {
  app.use(proxy('/api', {   
    target: 'http://127.0.0.1:3019',
    changeOrigin:true,
    pathRewrite: {
      "^/api": "/"
    }
  }))
  app.use(proxy('socket', {   
    target: 'http://127.0.0.1:3018',
  }))
  
}
