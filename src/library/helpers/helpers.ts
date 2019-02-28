export function isString (obj) {
	return (Object.prototype.toString.call(obj) === '[object String]');
}

export function getComponent<T> (element) {
	return element as T;
}
