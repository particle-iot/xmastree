export default function isShallowEqual(obj1, obj2, ignoreKeys){
	if (!obj1 && !obj2){
		return true;
	}
	if (!obj1 && obj2 || obj1 && !obj2){
		return false;
	}

	let keyCount1 = 0;
	let keyCount2 = 0;
	let usesIgnoreKeys = Array.isArray(ignoreKeys);
	let key;

	for (key in obj2){
		if (usesIgnoreKeys && ignoreKeys.includes(key)){
			continue;
		}

		keyCount2 += 1;

		if (!obj1.hasOwnProperty(key) || (obj1[key] !== obj2[key])){
			return false;
		}
	}

	for (key in obj1){
		if (usesIgnoreKeys && ignoreKeys.includes(key)){
			continue;
		}

		keyCount1 += 1;
	}
	return keyCount1 === keyCount2;
}
