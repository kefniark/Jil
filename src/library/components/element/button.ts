import { use } from 'typescript-mix';
import { h, VNode, Projector } from 'maquette';
import { JilNode, Transform, Clickable, TransformTween, Factory, ITransformParam, KeyboardEvents } from '../../behaviours';
import { isString, getParam } from '../../helpers';

export interface JilButton extends JilNode, Factory, Transform, Clickable, KeyboardEvents, TransformTween { }

export interface JilButtonParams extends ITransformParam {
	text?: string;
}

export class JilButton {
	@use(JilNode, Factory, Transform, Clickable, KeyboardEvents, TransformTween) public this: any;

	public text;

	constructor (id: string, params: JilButtonParams, parent: JilNode, projector: Projector | undefined) {
		this.id = id;
		this._parent = parent;
		this._projector = projector;
		this.resetClickable();
		this.resetKeyboardEvent();
		this.resetNode('button');

		if (!params) params = {};
		this.resetTransform(params);

		this.text = isString(params) ? params : getParam(params, 'text', 'Default Text');
	}

	public render (): VNode {
		return h('button',
			this.getProperties({ type: 'button' }),
			[ this.text ]
		);
	}
}
