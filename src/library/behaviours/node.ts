import { h, VNode, Projector } from 'maquette';

export class Node {
	public id?: string;
	public _projector?: Projector;
	public _parent?: Node;
	public _childrens: Node[] = [];

	public resetTransform () {
		this._childrens = [];
	}

	public addChild (element: Node) {
		this._childrens.push(element);
		this.refresh();
	}

	public removeChild (element: Node) {
		const i = this._childrens.indexOf(element);
		// tslint:disable:no-console
		console.log('remove child', element, i);
		if (i !== -1) {
			this._childrens.splice(i, 1);
		}
		this.refresh();
	}

	public destroy () {
		console.log('destroy', this.id, this._parent);
		if (this._parent) this._parent.removeChild(this);
	}

	public refresh () {
		if (this._projector) this._projector.scheduleRender();
	}

	public render (): VNode {
		return h('div', this._childrens.map((x) => x.render()));
	}

	public toString (): string {
		return `[UI ${this.id}]`;
	}
}
