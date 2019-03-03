import { use } from 'typescript-mix';
import { h, VNode, Projector } from 'maquette';
import { JilNode, Transform, Clickable, Factory, ITransformParam, KeyboardEvents } from '../../behaviours';
import { getParam } from '../../helpers';

export interface JilInput extends JilNode, Factory, Transform, Clickable, KeyboardEvents { }

export interface JilInputParams extends ITransformParam {
	name?: string;
	value?: string;
}

export class JilInput {
	@use(JilNode, Factory, Transform, Clickable, KeyboardEvents) public this: any;

	public name;
	public value;

	constructor (id: string, params: JilInputParams, parent: JilNode, projector: Projector | undefined) {
		this.id = id;
		this._parent = parent;
		this._projector = projector;
		this.resetClickable();
		this.resetKeyboardEvent();
		this.resetNode('input');

		if (!params) params = {};
		this.resetTransform(params);

		this.name = getParam(params, 'name', 'input');
		this.value = getParam(params, 'value', 'value');
	}

	public render (): VNode {
		return h('input', this.getProperties({ name: this.name, value: this.value }), []);
	}
}
