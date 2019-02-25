import { use } from 'typescript-mix';
import { h, VNode, Projector } from 'maquette';
import { Node, Transform, TransformTween } from '../../behaviours';
import { isString } from '../../helpers';

// tslint:disable-next-line:interface-name
export interface JilText extends Node, Transform, TransformTween { }

export class JilText {
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
