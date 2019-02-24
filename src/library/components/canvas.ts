import { use } from 'typescript-mix';
import { Node } from '../behaviours/node';
import { Transform } from '../behaviours/transform';
import { Clickable } from '../behaviours/clickable';
import { TransformTween } from '../behaviours/transformTween';
import { h, VNode, Projector } from 'maquette';

// tslint:disable-next-line:interface-name
export interface Canvas extends Node, Transform, Clickable, TransformTween { }

export class Canvas {
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
			width: 1280,
			height: 720,
			class: 'canvas',
			// styles: this.getStyle(),
			onclick: this.click.bind(this),
			afterCreate: this.handlerAfterCreate.bind(this),
			afterRemoved: this.handleAfterRemoved.bind(this)
		});
	}
}
