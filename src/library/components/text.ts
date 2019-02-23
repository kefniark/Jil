import { use } from 'typescript-mix';
import { Node } from '../behaviours/node';
import { Transform } from '../behaviours/transform';
import { h, VNode, Projector } from 'maquette';
import { TransformTween } from '../behaviours/transformTween';
import { isString } from '../helpers/helpers';

// tslint:disable-next-line:interface-name
export interface Text extends Node, Transform, TransformTween { }

export class Text {
	@use(Node, Transform, TransformTween) public this: any;

	public text;
	public styles;

	constructor (id: string, params: any, parent: Node, projector: Projector | undefined) {
		this.id = id;
		this.text = isString(params) ? params : params.text;
		if (!this.text) this.text = 'Default Text';
		this.styles = params || {};
		this._parent = parent;
		this._projector = projector;
		this.resetTransform();
		this.resetStyle();
	}

	public render (): VNode {
		return h('div', {
			id: this.id,
			key: this.id,
			class: 'text',
			styles: this.styles ? Object.assign(this.getStyle(), this.styles) : this.getStyle()
		}, [ this.text ]);
	}
}
