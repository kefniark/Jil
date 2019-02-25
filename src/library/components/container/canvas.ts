import { use } from 'typescript-mix';
import { h, VNode, Projector } from 'maquette';
import { Node, Transform, Clickable, TransformTween } from '../../behaviours';
import { resolution } from '../../config';

// tslint:disable-next-line:interface-name
export interface JilCanvas extends Node, Transform, Clickable, TransformTween { }

export class JilCanvas {
	@use(Node, Transform, Clickable, TransformTween) public this: any;

	constructor (id: string, params: any, parent: Node, projector: Projector | undefined) {
		this.id = id;
		this._parent = parent;
		this._projector = projector;
		this.resetClickable();
		this.resetTransform();
		this.resetStyle();
	}

	public render (): VNode {
		return h('canvas', {
			id: this.id,
			key: this.id,
			width: resolution.x,
			height: resolution.y,
			class: 'canvas',
			// styles: this.getStyle(),
			onclick: this.click.bind(this),
			afterCreate: this.handlerAfterCreate.bind(this),
			afterRemoved: this.handleAfterRemoved.bind(this)
		});
	}
}
