const withTypescript = require("@zeit/next-typescript")
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const withCSS = require('@zeit/next-css')

module.exports = withCSS(withTypescript({
  webpack: (config, options) => {
  	// Do not run type checking twice:
    if (options.isServer) config.plugins.push(new ForkTsCheckerWebpackPlugin())
    
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty'
    }

    return config
  },
  cssModules: true,
  cssLoaderOptions: {
    localIdentName: "[name]_[local]_[emoji:3]"
  }
}))