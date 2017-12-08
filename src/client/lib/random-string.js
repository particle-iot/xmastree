const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._~';


export default function randomString(length){
	const bytes = new Uint8Array(length);
	const random = window.crypto.getRandomValues(bytes);
	return Array.from(random).map(c => charset[c % charset.length]).join('');
}
