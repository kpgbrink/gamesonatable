const path = require('path');
const { addPlugins, getLoader, loaderByName, getPlugin, pluginByName, } = require('@craco/craco');
const webpack = require('webpack');

const packages = [];
packages.push(path.join(__dirname, '../api/src'));

module.exports = {
    webpack: {
        configure: (webpackConfig, { env, paths }) => {
            const { isFound, match } = getLoader(
                webpackConfig,
                loaderByName('babel-loader')
            );
            if (isFound) {
                const include = Array.isArray(match.loader.include) ?
                    match.loader.include : [match.loader.include];
                match.loader.include = [...include, ...packages];
            }

            // readable-stream tries to use process.nextTick() which CRA doesn't
            // polyfill because it uses WebPack 5 which readable-stream doesn't support
            // or something instead of WebPack 4 which readable-stream does support?
            // We can turn that on manually here. See https://github.com/nodejs/readable-stream/issues/450
            // and https://github.com/foliojs/pdfkit/issues/1195 .
            addPlugins(webpackConfig, [
                new webpack.ProvidePlugin({
                    process: 'process/browser',
                }),
            ]);
            return webpackConfig;
        },
    },
}