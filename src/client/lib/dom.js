export function registerServiceWorker(...args){
	if (window == null || !window.navigator.serviceWorker){
		return Promise.reject(new Error('service workers are not supported'));
	}
	return window.navigator.serviceWorker.register(...args);
}
