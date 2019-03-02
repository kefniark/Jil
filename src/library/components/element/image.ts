import { use } from 'typescript-mix';
import { h, VNode, Projector } from 'maquette';
import { JilNode, Transform, Clickable, TransformTween, Factory } from '../../behaviours';
import { isString } from '../../helpers';

// tslint:disable-next-line:interface-name
export interface JilImage extends JilNode, Factory, Transform, Clickable, TransformTween { }

export class JilImage {
	@use(JilNode, Factory, Transform, Clickable, TransformTween) public this: any;

	public src;
	public styles;
	public classnames: string;

	constructor (id: string, params: any, parent: JilNode, projector: Projector | undefined) {
		this.id = id;
		this.src = '';
		this.classnames = '';
		if (params) {
			if (isString(params)) {
				this.src = params;
			} else {
				this.src = params.src;
				this.classnames = params.class ? params.class : this.classnames;
			}
		}
		this.styles = params || {};
		this._parent = parent;
		this._projector = projector;
		this.resetClickable();
		this.resetNode('image');
		this.resetTransform();
	}

	public render (): VNode {
		const classes = ['image', this.classnames, this.getClassname('image')]
			.filter((x) => x && x.length > 0)
			.map((x) => x.toString().trim())
			.join(' ').trim();

		return h('img', {
			id: this.id,
			key: this.id,
			src: this.src,
			styles: this.styles ? Object.assign(this.getStyle(), this.styles) : this.getStyle(),
			class: classes,
			onclick: this.click.bind(this)
		});
	}
}
