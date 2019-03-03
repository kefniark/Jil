import { Vector2 } from './vector2';
import { Vector2Extend } from './vector2extend';

export function isString (obj) {
	return (Object.prototype.toString.call(obj) === '[object String]');
}

export function getComponent<T> (element) {
	return element as T;
}

export function shuffleArray (arr) {
	return arr.sort(() => Math.random() - 0.5);
}

export function getParam (data: any, prop: string, def: string) {
	if (!data) return def;
	if (!data[prop]) return def;
	return data[prop];
}

export function getParamBool (data: any, prop: string, def: boolean) {
	if (!data) return def;
	if (!data[prop]) return def;
	return !!data[prop];
}

export function getParamNum (data: any, prop: string, def: number) {
	if (!data) return def;
	if (data[prop] === undefined || data[prop] === null) return def;
	return data[prop];
}

export function getParamVec2 (data: any, prop: string, defx = 0, defy = 0) {
	if (!data) return new Vector2(defx, defy);
	if (!data[prop]) return new Vector2(defx, defy);
	if (data[prop].length !== 2) return new Vector2(defx, defy);
	return new Vector2(data[prop][0], data[prop][1]);
}

export function getParamVec2Extend (data: any, prop: string, defx = 0, defy = 0) {
	if (!data) return new Vector2Extend(defx, defy);
	if (!data[prop]) return new Vector2Extend(defx, defy);
	if (data[prop].length !== 2) return new Vector2Extend(defx, defy);
	return new Vector2Extend(data[prop][0], data[prop][1]);
}
