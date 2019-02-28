import { getComponent } from '../../helpers';
import { JilNode } from './node';

export const types = {};
export function register (type: string, className: any) {
	types[type] = className;
}

export class Factory {
	/**
	 * @ignore
	 */
	public create (type: string, id: string, params?: any) {
		if (!types[type]) {
			throw new Error(`Cannot create type ${type}`);
		}
		const node = getComponent<JilNode>(this);
		const child = new types[type](id, params, node, node._projector);
		node.addChild(child);
		return child;
	}
}
