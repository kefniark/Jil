import { use } from 'typescript-mix';
import { h, VNode, Projector } from 'maquette';
import { Node, Transform, Clickable, TransformTween } from '../../behaviours';

// tslint:disable-next-line:interface-name
export interface JilButton extends Node, Transform, Clickable, TransformTween { }

export class JilButton {
	@use(Node, Transform, Clickable, TransformTween) public this: any;
	public text;

	constructor (id: string, params: any, parent: Node, projector: Projector | undefined) {
		this.id = id;
		this.text = params;
		this._parent = parent;
		this._projector = projector;
		this.resetClickable();
		this.resetTransform();
		this.resetStyle();
	}

	public render (): VNode {
		return h('button', {
			id: this.id,
			key: this.id,
			type: 'button',
			class: 'nes-btn',
			styles: this.getStyle(),
			onclick: this.click.bind(this)
		}, [ this.text ]);
	}
}
