const path = require('path');
const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const BabiliPlugin = require('babel-minify-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const secureFilters = require('secure-filters');
const config = require('./src/config');
const publicDir = config.get('paths.public');
const clientSrcDir = config.get('paths.clientSrc');
const assetsDir = path.join(clientSrcDir, 'assets');
const ENV_PROD = 'production';
const ENV_DEV = 'development';
const ENV_ANALYSIS = 'analysis';


module.exports = function(env = process.env.NODE_ENV){
	let cfg = {
		devtool: false,
		plugins: [],
		entry: {
			bundle: path.join(__dirname, clientSrcDir, 'index.js'),
			styles: path.join(__dirname, clientSrcDir, '/styles/index.scss')
		},
		output: {
			filename: '[chunkhash]-[name].js',
			path: path.join(__dirname, publicDir)
		},
		module: {
			rules: [{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					use: [
						{ loader: 'css-loader' },
						{ loader: 'sass-loader' }
					]
				})
			}]
		}
	};

	if (env === ENV_PROD || env === ENV_ANALYSIS){
		cfg.plugins.push(new webpack.DefinePlugin({
			'process.env': { NODE_ENV: JSON.stringify('production') }
		}));

		cfg.plugins.push(new BabiliPlugin());

		if (env === ENV_ANALYSIS){
			cfg.plugins.push(new BundleAnalyzerPlugin({
				analyzerMode: 'server',
				analyzerPort: 8888,
				openAnalyzer: true,
				generateStatsFile: true,
				statsFilename: 'stats.json'
			}));
		}
	} else {
		cfg.devtool = 'inline-source-map';
	}

	cfg.plugins.push(new CopyPlugin([
		assetsDir,
		{ from: require.resolve('workbox-sw'), to: 'workbox-sw.prod.js' }
	]));

	cfg.plugins.push(new ExtractTextPlugin({ filename: '[chunkhash]-[name].css' }));

	cfg.plugins.push(new HtmlPlugin({
		template: path.join(assetsDir, 'index.html'),
		excludeJS: ['styles.js'], // TODO (mirande): https://github.com/webpack/webpack/issues/1967
		clientConfigs: getClientConfigs(config),
		inject: false,
		hash: false
	}));

	cfg.plugins.push(new WorkboxPlugin({
		globDirectory: path.join(__dirname, publicDir),
		globPatterns: ['**/*.{html,js,css,ico}'],
		globIgnores: ['*styles.js'], // TODO (mirande): https://github.com/webpack/webpack/issues/1967
		swSrc: path.join(clientSrcDir, 'service-worker.js'),
		swDest: path.join(publicDir, 'sw.js')
	}));

	return cfg;
};

module.exports.get = function(env){
	return module.exports(env);
};

module.exports.getForProduction = function(){
	return module.exports(ENV_PROD);
};

module.exports.getForAnalysis = function(){
	return module.exports(ENV_ANALYSIS);
};

module.exports.getForDevelopment = function(){
	return module.exports(ENV_DEV);
};


// INTERNAL UTILS /////////////////////////////////////////////////////////////
function getClientConfigs(cfg){
	return secureFilters.jsObj({
		clientId: cfg.get('client.id'),
		apiUrl: cfg.get('api.url'),
		repoUrl: cfg.get('urls.repo'),
		appUrl: cfg.get('urls.app')
	});
}
