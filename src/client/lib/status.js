import snakeCase from 'lodash/snakeCase';

const CODE_INIT = 'init';
const CODE_OK = 'ok';
const CODE_FAIL = 'fail';
const CODES = [CODE_INIT, CODE_OK, CODE_FAIL];
const statusSpecs = [
	{ type: 'login', code: 'init', message: 'logging in' },
	{ type: 'login-ok', code: 'ok', message: 'logged in' },
	{ type: 'login-fail', code: 'fail', message: 'failed to login' },
	{ type: 'devices-fetch', code: 'init', message: 'fetching devices' },
	{ type: 'devices-fetch-ok', code: 'ok', message: 'received devices' },
	{ type: 'devices-fetch-fail', code: 'fail', message: 'unable to fetch devices' },
	{ type: 'device-qualify', code: 'init', message: 'qualifying device' },
	{ type: 'device-qualify-ok', code: 'ok', message: 'device is ready to go!' },
	{ type: 'device-qualify-fail', code: 'fail', message: 'device is not available - make sure it is connected & running the firmware' },
	{ type: 'treestate-fetch', code: 'init', message: 'fetching tree state' },
	{ type: 'treestate-fetch-ok', code: 'ok', message: 'received tree state' },
	{ type: 'treestate-fetch-fail', code: 'fail', message: 'unable to fetch tree state' },
	{ type: 'listen', code: 'init', message: 'attaching device event listeners' },
	{ type: 'listen-ok', code: 'ok', message: 'listening to device events' },
	{ type: 'listen-fail', code: 'fail', message: 'unable to attach device event listeners' },
	{ type: 'song-set', code: 'init', message: 'setting song' },
	{ type: 'song-set-ok', code: 'ok', message: 'song set successfully' },
	{ type: 'song-set-fail', code: 'fail', message: 'unable to set song' },
	{ type: 'song-playtoggle', code: 'init', message: 'toggling song playback' },
	{ type: 'song-playtoggle-ok', code: 'ok', message: 'toggled song playback' },
	{ type: 'song-playtoggle-fail', code: 'fail', message: 'unable to toggle song playback' },
	{ type: 'animation-set', code: 'init', message: 'setting animation' },
	{ type: 'animation-set-ok', code: 'ok', message: 'animation set successfully' },
	{ type: 'animation-set-fail', code: 'fail', message: 'unable to set animation' },
	{ type: 'animation-playtoggle', code: 'init', message: 'toggling animation playback' },
	{ type: 'animation-playtoggle-ok', code: 'ok', message: 'toggled animation playback' },
	{ type: 'animation-playtoggle-fail', code: 'fail', message: 'unable to toggle animation playback' }
];

class Status {
	constructor(spec){
		if (!spec || !spec.type || !spec.code || !spec.message){
			throw new Error('status `type`, `code`, and `message` must be provided!');
		}
		if (!CODES.some(t => t === spec.code)){
			throw new Error('status type must be one of `init`, `ok`, or `fail`');
		}

		this.type = spec.type;
		this.code = spec.code;
		this.message = spec.message;
	}

	isInit(){
		return this.code === CODE_INIT;
	}

	isOk(){
		return this.code === CODE_OK;
	}

	isFail(){
		return this.code === CODE_FAIL;
	}

	className(){
		return `is-${this.code}`;
	}

	clone(spec){
		return new Status(Object.assign({}, this, spec));
	}
}


export const Statuses = statusSpecs.reduce((out, spec) => {
	const key = `STATUS_${snakeCase(spec.type).toUpperCase()}`;
	out[key] = new Status(spec);
	return out;
}, {});
