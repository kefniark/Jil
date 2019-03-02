import { use } from 'typescript-mix';
import { h, VNode, Projector } from 'maquette';
import { JilNode, Transform, Clickable, TransformTween, Factory } from '../../behaviours';
import { isString } from '../../helpers';

// tslint:disable-next-line:interface-name
export interface JilButton extends JilNode, Factory, Transform, Clickable, TransformTween { }

export class JilButton {
	@use(JilNode, Factory, Transform, Clickable, TransformTween) public this: any;

	public text;
	public styles;
	public classnames: string;

	constructor (id: string, params: any, parent: JilNode, projector: Projector | undefined) {
		this.id = id;
		this.text = 'Default Text';
		this.classnames = '';
		if (params) {
			if (isString(params)) {
				this.text = params;
			} else {
				this.text = params.text;
				this.classnames = params.class;
			}
		}
		this.styles = params || {};
		this._parent = parent;
		this._projector = projector;
		this.resetClickable();
		this.resetNode('button');
		this.resetTransform();
	}

	public render (): VNode {
		const classes = ['button', this.classnames, this.getClassname('button')]
			.filter((x) => x && x.length > 0)
			.map((x) => x.toString().trim())
			.join(' ').trim();

		return h('button', {
			id: this.id,
			key: this.id,
			type: 'button',
			class: classes,
			styles: this.getStyle(),
			onclick: this.click.bind(this)
		}, [ this.text ]);
	}
}
