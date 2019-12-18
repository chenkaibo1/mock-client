// const os = require('os');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// const isProduction = process.env.NODE_ENV === 'production'
module.exports = {
  // assetsDir: 'static',
  productionSourceMap: false,
  devServer: {
    port: process.env.NODE_ENV === 'test' ? '8090' : '9090',
    proxy: {
      '/image': {
        target: 'http://localhost:20000',
        changeOrigin: true
      },
      '/api': {
        target: 'http://localhost:20000',
        changeOrigin: true
      },
      '/mock': {
        target: 'http://localhost:20000',
        changeOrigin: true
      }
    }
  },
  configureWebpack: (config) => {
    // config.resolve.extensions = [ '.js', '.ts', '.vue', '.json' ]
    if (process.env.NODE_ENV === 'test') {
      config.entry.app = [ './src/test.ts' ]
    }
    // if (isProduction) {
    //   // 为生产环境修改配置...
    //   config.plugins.push(
    //     // 生产环境自动删除console
    //     new UglifyJsPlugin({
    //       uglifyOptions: {
    //         compress: {
    //           drop_debugger: true,
    //           drop_console: true
    //         }
    //       },
    //       sourceMap: false,
    //       parallel: true
    //     })
    //   )
    // }
  }
  // chainWebpack: (config) => {
  //   if (isProduction) {
  //     // 压缩代码
  //     config.optimization.minimize(true)
  //     // 分割代码
  //     config.optimization.splitChunks({
  //       chunks: 'all'
  //     })
  //   }
  //   return config
  // }
}
