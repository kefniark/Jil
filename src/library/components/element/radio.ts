import { use } from 'typescript-mix';
import { h, VNode, Projector } from 'maquette';
import { JilNode, Transform, Clickable, Factory, ITransformParam, KeyboardEvents } from '../../behaviours';
import { getParam, getParamBool } from '../../helpers';

export interface JilRadio extends JilNode, Factory, Transform, Clickable, KeyboardEvents { }

export interface JilRadioParams extends ITransformParam {
	name?: string;
	value?: string;
	text?: string;
	checked?: boolean;
}

export class JilRadio {
	@use(JilNode, Factory, Transform, Clickable, KeyboardEvents) public this: any;

	public name;
	public value;
	public text;
	public checked: boolean;

	constructor (id: string, params: JilRadioParams, parent: JilNode, projector: Projector | undefined) {
		this.id = id;
		this._parent = parent;
		this._projector = projector;
		this.resetClickable();
		this.resetKeyboardEvent();
		this.resetNode('radio');

		if (!params) params = {};
		this.resetTransform(params);

		this.text = getParam(params, 'text', 'Label');
		this.name = getParam(params, 'name', 'checkbox');
		this.value = getParam(params, 'value', 'value');
		this.checked = getParamBool(params, 'checked', false);
	}

	public render (): VNode {
		return h('label', {
			id: 'label_' + this.id,
			key: 'label_' + this.id,
			styles: this.getStyle(),
			afterCreate: (evt) => {
				const query = document.querySelector('input[name="' + this.name + '"]:checked');
				if (!query) {
					this.checked = true;
					this.refresh();
				}
			},
			class: this.getClassnames()
		}, [
			h('input', {
				type: 'radio',
				name: this.name,
				value: this.value,
				id: this.id,
				key: this.id,
				checked: this.checked,
				class: this.getClassnames(),
				onclick: this.click.bind(this)
			}, []),
			h('span', {}, [ this.text ])
		]);
	}
}
