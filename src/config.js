const convict = require('convict');
const pkg = require('../package.json');


module.exports = convict({
	name: pkg.name,
	version: {
		doc: 'application version',
		default: pkg.version,
		format: String
	},
	paths: {
		public: {
			doc: 'public directory used to serve static files',
			default: './docs',
			format: String,
			env: 'PATHS_PUBLIC'
		},
		clientSrc: {
			doc: 'location of client application files',
			default: './src/client',
			format: String,
			env: 'PATHS_CLIENT_SRC'
		}
	},
	urls: {
		repo: {
			doc: 'url to the github repo hosting the source code for this app',
			default: 'https://github.com/spark/xmastree',
			format: 'url',
			env: 'URLS_REPO'
		},
		app: {
			doc: 'url to this website',
			default: '"https://spark.github.io/xmastree',
			format: 'url',
			env: 'URLS_APP'
		},
	},
	client: {
		id: {
			doc: 'the particle client id for this app (primarily for oauth)',
			default: 'xmastree-1511',
			format: String,
			env: 'CLIENT_ID'
		}
	},
	api: {
		url: {
			doc: 'root url for the particle api',
			default: 'https://api.particle.io',
			format: 'url',
			env: 'PARTICLE_API_URL'
		}
	}
});
