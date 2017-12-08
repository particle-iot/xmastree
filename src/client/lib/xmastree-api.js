import set from 'lodash/set';
import isFn from 'lodash/isFunction';
import toInt from 'lodash/toInteger';
import Particle from 'particle-api-js';

const TIMEOUT_MS = 10000;
const FN_SONG_PLAY = 'playSong';
const FN_SONG_STOP = 'stopSong';
const FN_ANIMATION_PLAY = 'playAnim';
const FN_ANIMATION_STOP = 'stopAnim';
const VAR_WHOAMI_NAME = 'whoami';
const VAR_WHOAMI_VALUE = 'XmasTree';
const VAR_VERSION_NAME = 'version';
const VAR_VERSION_VALUE = 1;
const VAR_STATE_CURRENT = 'currState';
const VAR_SONG_CURRENT = 'currSong';
const VAR_SONG_COUNT = 'songCount';
const VAR_ANIMATION_CURRENT = 'currAnim';
const VAR_ANIMATION_COUNT = 'animCount';
const stateVars = [
	{ name: VAR_STATE_CURRENT, key: 'state' },
	{ name: VAR_SONG_CURRENT, key: 'song.id' },
	{ name: VAR_SONG_COUNT, key: 'song.count' },
	{ name: VAR_ANIMATION_CURRENT, key: 'animation.id' },
	{ name: VAR_ANIMATION_COUNT, key: 'animation.count' }
];


class XmastreeApi {
	constructor({ apiUrl = '', token = '', timeout = TIMEOUT_MS } = {}){
		this.token = token;
		this.timeout = timeout;
		this._handlers = null;
		this._eventStream = null;
		this._onEvent = this._onEvent.bind(this);
		this._api = new Particle({ baseUrl: apiUrl });
	}

	fetchDeviceList(){
		const { token: auth, timeout, _api, withTimeout } = this;

		return withTimeout(_api.listDevices({ auth }), timeout)
			.then(res => res.body);
	}

	qualifyDevice({ device } = {}){
		const vars = [VAR_WHOAMI_NAME, VAR_VERSION_NAME]
			.map(name => this.readVariable({ device, name }));

		return Promise.all(vars)
			.then(values => {
				const [whoami, version] = values;

				if (!hasExpectedWhoAmI(whoami)){
					throw new XmastreeApiFirmwareError('firmware is not running'); // eslint-disable-line no-use-before-define
				}

				if (version < VAR_VERSION_VALUE){
					throw new XmastreeApiFirmwareError(`firmware version mismatch - was: ${version}, expected: ${VAR_VERSION_VALUE} or greater`); // eslint-disable-line no-use-before-define
				}
				return device;
			});
	}

	fetchTreestate({ device } = {}){
		const vars = stateVars.map(v => this.readVariable({ device, name: v.name }));

		return Promise.all(vars)
			.then(values => values.reduce((out, val, i) => set(out, stateVars[i].key, val), {}))
			.then(tree => setIsPlayingState(tree.state, tree));
	}

	playSong({ device, songId } = {}){
		const command = { name: FN_SONG_PLAY, arg: String(songId) };
		return this.callFunction({ device, command });
	}

	stopSong({ device } = {}){
		const command = { name: FN_SONG_STOP };
		return this.callFunction({ device, command });
	}

	playAnimation({ device, animationId } = {}){
		const command = { name: FN_ANIMATION_PLAY, arg: String(animationId) };
		return this.callFunction({ device, command });
	}

	stopAnimation({ device } = {}){
		const command = { name: FN_ANIMATION_STOP };
		return this.callFunction({ device, command });
	}

	registerEventHandlers({ device, handlers }){
		if (!this._eventStream){
			return this._initEventStream({ device })
				.then(() => this.registerEventHandlers({ device, handlers }));
		}

		return new Promise((resolve, reject) => {
			if (!this.hasEventHandlers()){
				this._handlers = [];
			}

			this._handlers.push(handlers);
			resolve(this.unregisterEventHandlers.bind(this, handlers));
		});
	}

	unregisterEventHandlers(handlers){
		if (!this.hasEventHandlers()){
			return;
		}

		this._handlers = this._handlers.filter(h => h !== handlers);

		if (!this.hasEventHandlers() && this._eventStream){
			this._eventStream.removeAllListeners();
			this._eventStream = null;
			this._handlers = null;
		}
	}

	hasEventHandlers(){
		if (!Array.isArray(this._handlers)){
			return false;
		}
		return this._handlers.length > 0;
	}

	_initEventStream({ device }){
		const { token: auth, timeout, _api, withTimeout } = this;
		const params = { deviceId: device.id, auth };

		return withTimeout(_api.getEventStream(params), timeout)
			.then(stream => {
				this._eventStream = stream;
				this._eventStream.on('event', this._onEvent);
			});
	}

	_onEvent(event){
		if (!this.hasEventHandlers()){
			return;
		}
		this._handlers.forEach(h => {
			let name, arg;

			switch (event.name){
				case 'stateChanged':
					name = 'onStateChange';
					arg = setIsPlayingState(event.data, {});
					return this._callEventHandler(h, name, arg);

				case 'songChanged':
					name = 'onSongChange';
					arg = toInt(event.data);
					return this._callEventHandler(h, name, arg);

				case 'animChanged':
					name = 'onAnimationChange';
					arg = toInt(event.data);
					return this._callEventHandler(h, name, arg);
			}
		});
	}

	_callEventHandler(handlerMap, name, arg){
		const fn = handlerMap[name];

		if (isFn(fn)){
			fn(arg);
		}
	}

	readVariable({ device, name } = {}){
		const { token: auth, timeout, _api, withTimeout } = this;
		const params = { deviceId: device.id, name, auth };

		return withTimeout(_api.getVariable(params), timeout)
			.then(res => res.body.result);
	}

	callFunction({ device, command } = {}){
		const { token: auth, timeout, _api, withTimeout } = this;
		const params = { deviceId: device.id, name: command.name, argument: command.arg, auth };

		return withTimeout(_api.callFunction(params), timeout)
			.then(res => res.body.return_value);
	}

	withTimeout(promise, ms = 10000){
		return new Promise(function(resolve, reject){
			promise.then(resolve).catch(reject);
			setTimeout(() => reject(new XmastreeApiTimeoutError()), ms); // eslint-disable-line no-use-before-define
		});
	}
}

class XmastreeApiFirmwareError extends Error {
	constructor(message) {
		super(message);
		Error.captureStackTrace(this, XmastreeApiFirmwareError);
		this.code = 'firmware';
	}
}

class XmastreeApiTimeoutError extends Error {
	constructor(message = 'request timed out') {
		super(message);
		Error.captureStackTrace(this, XmastreeApiTimeoutError);
		this.code = 'timeout';
	}
}

export default function createXmastreeApi(...args){
	return new XmastreeApi(...args);
}


// INTERNAL UTILS /////////////////////////////////////////////////////////////
function hasExpectedWhoAmI(value){
	return value.toLowerCase() === VAR_WHOAMI_VALUE.toLowerCase();
}

function setIsPlayingState(stateCode, tree){
	const code = String(stateCode);

	tree.state = code;
	set(tree, 'song.isPlaying', false);
	set(tree, 'animation.isPlaying', false);

	switch (code){
		case '1':
			tree.animation.isPlaying = true;
			break;
		case '2':
			tree.song.isPlaying = true;
			break;
		case '3':
			tree.song.isPlaying = true;
			tree.animation.isPlaying = true;
			break;
	}
	return tree;
}
