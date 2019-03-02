import { getComponent } from '../../helpers';
import { JilNode } from './node';
import { Layout } from '../layout/layout';

const types = {};
export function registerComponent (type: string, className: any) {
	types[type] = className;
}

const layout = {};
export function registerLayout (id: string, className: (container: Layout, elements: JilNode[]) => void) {
	layout[id] = className;
}

const classNames = {};
export function registerClassname (id: string, className: string) {
	classNames[id] = className;
}

export class Factory {
	/**
	 * @ignore
	 */
	public createComponent (type: string, id: string, params?: any) {
		if (!types[type]) {
			throw new Error(`Cannot create type ${type}`);
		}
		const node = getComponent<JilNode>(this);
		const child = new types[type](id, params, node, node._projector);
		node.addChild(child);
		return child;
	}

	public getLayout (id: string): (container: Layout, elements: JilNode[]) => void {
		return layout[id];
	}

	public getClassname (id: string): string {
		return classNames[id] ? classNames[id] : '';
	}
}
