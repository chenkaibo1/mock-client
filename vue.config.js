// const os = require('os');
module.exports = {
	// assetsDir: 'static',
	productionSourceMap: false,
	devServer: {
		port: process.env.NODE_ENV === 'test' ? '8090' : '9090',
		proxy: 'http://localhost:20000'
	},
	configureWebpack: (config) => {
		// for (let i = 0; i < config.rules.module.length; i++) {
		//   console.log(config.rules.module[i])
		// }
		// config.resolve.extensions = [ '.js', '.ts', '.vue', '.json' ]
		console.log(config)
		if (process.env.NODE_ENV === 'test') {
			config.entry.app = [ './src/test.ts' ]
		}
	}
	// chainWebpack: (config) => {
	//   // config.plugin('fork-ts-checker').tap((args) => {
	//   //   args[0].workersNumber = os.cpus.length
	//   //   args[0].memoryLimit = 4096
	//   //   return args
	//   // })
	//   // 修改它的选项...
	//   console.log(config.plugins)
	//   return config
	// }
	// pluginOptions: {
	//   i18n: {
	//     locale: 'zh_CN', // The locale of project localization
	//     fallbackLocale: 'en', // The fallback locale of project localization
	//     localeDir: 'locales', // The directory where store localization messages of project
	//     enableInSFC: false // Enable locale messages in Single file components
	//   }
	// }
}
