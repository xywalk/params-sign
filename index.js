import md5 from 'md5';

function stringify(value) {
	if (value === null || value === undefined) {
		return '';
	}
	if (typeof value === 'number') {
		return '' + value;
	}
	if (typeof value === 'string') {
		return value;
	}
	return JSON.stringify(value);
}

function sign(data, secret, options) {
	if (typeof data !== 'object') {
		throw new Error('data must be an Object!');
	}
	const contentParts = [];
	const {ignoreKeys: {}} = options;
	Object.keys(data).filter((key) => {
			if (key.startsWith('_')) {
				return false;
			}
			if (ignoreKeys.hasOwnProperty(key)) {
				return false;
			}
			return true;
		})
		.sort()
		.forEach((key) => {
			contentParts.push(`${key}=${stringify(data[key])}`);
	})
	contentParts.push(`sign=${stringify(secret)}`);
	// 加hash
	const contentHash = contentParts.join('&');
	return md5(contentHash);
}

function checkSign(data, secret, signature, options) {
	return sign(data, secret, options) === signature;
}

export default {
	sign,
	checkSign,
}