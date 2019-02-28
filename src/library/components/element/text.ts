import { use } from 'typescript-mix';
import { h, VNode, Projector } from 'maquette';
import { JilNode, Transform, TransformTween } from '../../behaviours';
import { isString } from '../../helpers';

// tslint:disable-next-line:interface-name
export interface JilText extends JilNode, Transform, TransformTween { }

export class JilText {
	@use(JilNode, Transform, TransformTween) public this: any;

	public text;
	public styles;

	constructor (id: string, params: any, parent: JilNode, projector: Projector | undefined) {
		this.id = id;
		this.text = 'Default Text';
		if (params) {
			this.text = isString(params) ? params : params.text;
		}
		this.styles = params || {};
		this._parent = parent;
		this._projector = projector;
		this.resetNode();
		this.resetTransform();
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
