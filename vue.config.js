// const os = require('os');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const isProduction = process.env.NODE_ENV === 'production'
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
    config.module.rules.push({
      test: /\.snippets/,
      use: [
        {
          loader: 'raw-loader'
        }
      ]
    })
    if (isProduction) {
      config.plugins.push(
        // 生产环境自动删除console
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              drop_debugger: true,
              drop_console: true
            }
          },
          sourceMap: false,
          parallel: true
        })
      )
      config.plugins.push(
        new CompressionPlugin({
          test: /\.js$|\.html$|.\css/, // 匹配文件名
          threshold: 10240, // 对超过10k的数据压缩
          deleteOriginalAssets: false // 不删除源文件
        })
      )
    }
  },
  chainWebpack: (config) => {
    config.module
      .rule('md')
      .test(/\.md/)
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('vue-markdown-loader')
      .loader('vue-markdown-loader/lib/markdown-compiler')
      .options({
        raw: true,
        breaks: false,
        use: [
          require('markdown-it-attrs'),
          [
            require('markdown-it-anchor'),
            {
              permalinkClass: 'anchor',
              slugify: require('transliteration').slugify,
              permalinkSymbol: '<i class="el-icon-collection-tag color-blue"></i>',
              permalink: true,
              permalinkBefore: true
            }
          ]
        ]
      })
    // config.module.rule('raw').test(/\.snippets/).use('raw-loader').loader('raw-loader').end()
  }
}
