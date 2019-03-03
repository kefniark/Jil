import { use } from 'typescript-mix';
import { h, VNode, Projector } from 'maquette';
import { JilNode, Transform, Clickable, Factory, ITransformParam, KeyboardEvents } from '../../behaviours';
import { getParam } from '../../helpers';

export interface JilSelect extends JilNode, Factory, Transform, Clickable, KeyboardEvents { }

/**
 * @ignore
 */
export interface JilSelectParams extends ITransformParam {
	name?: string;
	value?: string;
	options?: JilSelectOption[];
}

export interface JilSelectOption {
	text: string;
	value: string;
}

export class JilSelect {
	@use(JilNode, Factory, Transform, Clickable, KeyboardEvents) public this: any;

	public name;
	public value;
	public options: JilSelectOption[];

	constructor (id: string, params: JilSelectParams, parent: JilNode, projector: Projector | undefined) {
		this.id = id;
		this._parent = parent;
		this._projector = projector;
		this.resetClickable();
		this.resetKeyboardEvent();
		this.resetNode('radio');

		if (!params) params = {};
		this.resetTransform(params);

		this.name = getParam(params, 'name', 'select');
		this.value = getParam(params, 'value', '');
		this.options = params.options ? params.options : [];
	}

	public render (): VNode {
		const classes = ['select', this.classnames, this.getClassname('select')]
			.filter((x) => x && x.length > 0)
			.map((x) => x.toString().trim())
			.join(' ').trim();

		const val = !this.value && this.options.length > 0 ? this.options[0].value : this.value;
		return h('select',
			this.getProperties({ name: this.name, value: val }),
			this.options.map((x) => h('option', { value: x.value }, [ x.text ])
		));
	}
}
