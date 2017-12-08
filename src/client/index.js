import { createElement } from 'react';
import { render } from 'react-dom';
import { registerServiceWorker } from './lib/dom.js';
import createDB from './lib/db.js';
import App from './components/app.js';

const cfg = window['__xmastree/config'] || {};


registerServiceWorker('./sw.js', { scope: '.' })
	.catch(err => console.error(err)); // eslint-disable-line no-console

render(
	createElement(App, {
		db: createDB(),
		clientId: cfg.clientId,
		apiUrl: cfg.apiUrl,
		repoUrl: cfg.repoUrl,
		appUrl: cfg.appUrl
	}),
	document.getElementById('root')
);
