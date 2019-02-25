import { use } from 'typescript-mix';
import { h, VNode, Projector } from 'maquette';
import { Node, Transform, Clickable, TransformTween } from '../../behaviours';
import { isString } from '../../helpers';

// tslint:disable-next-line:interface-name
export interface JilImage extends Node, Transform, Clickable, TransformTween { }

export class JilImage {
	@use(Node, Transform, Clickable, TransformTween) public this: any;

	public src;
	public styles;

	constructor (id: string, params: any, parent: Node, projector: Projector | undefined) {
		this.id = id;
		this.src = isString(params) ? params : params.src;
		if (!this.src) this.src = '';
		this.styles = params || {};
		this._parent = parent;
		this._projector = projector;
		this.resetClickable();
		this.resetTransform();
		this.resetStyle();
	}

	public render (): VNode {
		return h('img', {
			id: this.id,
			key: this.id,
			src: this.src,
			styles: this.styles ? Object.assign(this.getStyle(), this.styles) : this.getStyle(),
			onclick: this.click.bind(this)
		});
	}
}
