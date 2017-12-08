import randomString from './random-string.js';

const STATUS_PENDING = 'pending';
const STATUS_FAIL = 'fail';
const STATUS_OK = 'ok';


class OAuthImplicit {
	constructor({ apiUrl = '', clientId = '' } = {}){
		this.apiUrl = apiUrl;
		this.clientId = clientId;
		this.KEY_CSRF = 'csrf';
	}

	login(){
		const csrf = randomString(24);
		this.setCSRF(csrf);
		this.redirectToProvider(csrf);
	}

	getResponse(){
		const params = this.getUrlParams('token', 'state', 'error');
		const csrf = this.getCSRF();

		this.clearUrlHash();
		this.deleteCSRF();

		if (!Object.keys(params).length){
			return createResponse({ status: STATUS_PENDING });
		}

		if (params.token && params.state){
			if (params.state === csrf){
				return createResponse({ status: STATUS_OK, token: params.token });
			} else {
				return createResponse({
					status: STATUS_FAIL,
					message: 'CSRF Tokens do not match',
					error: params.error
				});
			}
		}

		return createResponse({ status: STATUS_FAIL, error: params.error });
	}

	redirectToProvider(csrf){
		const url = this.getProviderUrl(csrf);
		window.location.href = url;
	}

	getProviderUrl(csrf){
		const { apiUrl, clientId } = this;
		return `${apiUrl}/oauth/authorize?client_id=${clientId}&response_type=token&state=${csrf}`;
	}

	getUrlParams(...keys){
		let out = {};
		const hash = window.location.hash.slice(1);
		const params = new URLSearchParams(hash);

		return keys.reduce((out, k) => {
			const value = params.get(k);

			if (value != null){
				out[k] = value;
			}
			return out;
		}, out);
	}

	clearUrlHash(){
		window.history.replaceState({}, window.document.title, '.');
	}

	setCSRF(csrf){
		if (!csrf){
			throw new Error('csrf token is required!');
		}
		window.localStorage.setItem(this.KEY_CSRF, csrf);
	}

	getCSRF(){
		return window.localStorage.getItem(this.KEY_CSRF);
	}

	deleteCSRF(){
		window.localStorage.removeItem(this.KEY_CSRF);
	}
}

class OAuthResponse {
	constructor({ status, token, message, error } = {}){
		this.status = status;
		this.message = message;
		this.error = error;
		this.token = token || null;
		this.success = this.status === STATUS_OK;

		if (!this.success && !this.message){
			this.message = 'Login Failed';
		}
	}

	isPending(){
		return this.status === STATUS_PENDING;
	}

	isFailure(){
		return this.status === STATUS_FAIL;
	}

	isOk(){
		return this.status === STATUS_OK;
	}
}

function createResponse({ status, token, message, error } = {}){
	switch (status){
		case STATUS_OK:
			return new OAuthResponse({ status, token });

		case STATUS_FAIL:
			return new OAuthResponse({ status, message, error });

		default:
			return new OAuthResponse({ status: STATUS_PENDING });
	}
}


export default function createOAuth(...args){
	return new OAuthImplicit(...args);
}
