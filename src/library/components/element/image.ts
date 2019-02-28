import { use } from 'typescript-mix';
import { h, VNode, Projector } from 'maquette';
import { JilNode, Transform, Clickable, TransformTween } from '../../behaviours';
import { isString } from '../../helpers';

// tslint:disable-next-line:interface-name
export interface JilImage extends JilNode, Transform, Clickable, TransformTween { }

export class JilImage {
	@use(JilNode, Transform, Clickable, TransformTween) public this: any;

	public src;
	public styles;

	constructor (id: string, params: any, parent: JilNode, projector: Projector | undefined) {
		this.id = id;
		this.src = '';
		if (params) {
			this.src = isString(params) ? params : params.src;
		}
		this.styles = params || {};
		this._parent = parent;
		this._projector = projector;
		this.resetClickable();
		this.resetNode();
		this.resetTransform();
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
