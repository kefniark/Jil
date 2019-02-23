import { use } from 'typescript-mix';
import { Node } from '../behaviours/node';
import { Transform } from '../behaviours/transform';
import { h, VNode, Projector } from 'maquette';
import { Factory } from '../behaviours/factory';
import { TransformTween } from '../behaviours/transformTween';

// tslint:disable-next-line:interface-name
export interface Panel extends Node, Transform, Factory, TransformTween { }

export class Panel {
	@use(Node, Transform, Factory, TransformTween) public this: any;

	constructor (id: string, params: any, parent: Node, projector: Projector | undefined) {
		this.id = id;
		this._parent = parent;
		this._projector = projector;
		this.resetTransform();
		this.resetStyle();
	}

	public render (): VNode {
		return h('div', {
			id: this.id,
			key: this.id,
			class: 'panel',
			styles: this.getStyle()
		}, this._childrens.map((x) => x.render()));
	}

	public createPanel = (id: string) => this.create('panel', id) as Node;
	public createButton = (id: string, params: string | any) => this.create('button', id, params) as Node;
	public createImage = (id: string, params: string | any) => this.create('image', id, params) as Node;
	public createText = (id: string, params: string | any) => this.create('text', id, params) as Node;
}
