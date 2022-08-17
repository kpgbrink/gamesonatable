const path = require('path');
const { getLoader, loaderByName } = require('@craco/craco');

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
            return webpackConfig;
        },
    },
}