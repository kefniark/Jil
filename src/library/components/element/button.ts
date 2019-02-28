import { use } from 'typescript-mix';
import { h, VNode, Projector } from 'maquette';
import { JilNode, Transform, Clickable, TransformTween } from '../../behaviours';

// tslint:disable-next-line:interface-name
export interface JilButton extends JilNode, Transform, Clickable, TransformTween { }

export class JilButton {
	@use(JilNode, Transform, Clickable, TransformTween) public this: any;
	public text;

	constructor (id: string, params: any, parent: JilNode, projector: Projector | undefined) {
		this.id = id;
		this.text = params;
		this._parent = parent;
		this._projector = projector;
		this.resetClickable();
		this.resetNode();
		this.resetTransform();
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
