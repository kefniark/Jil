import { use } from 'typescript-mix';
import { h, VNode, Projector } from 'maquette';
import { JilNode, Transform, Clickable, Factory } from '../../behaviours';

// tslint:disable-next-line:interface-name
export interface JilCheckbox extends JilNode, Factory, Transform, Clickable { }

export class JilCheckbox {
	@use(JilNode, Factory, Transform, Clickable) public this: any;

	public name;
	public value;
	public text;
	public styles;
	public classnames: string;
	public checked: boolean;

	constructor (id: string, params: any, parent: JilNode, projector: Projector | undefined) {
		this.id = id;
		this.text = 'text';
		this.name = 'checkbox';
		this.value = 'value';
		this.classnames = '';
		this.checked = false;
		if (params) {
			this.text = params.text ? params.text : this.text;
			this.name = params.name ? params.name : this.name;
			this.value = params.value ? params.value : this.value;
			this.classnames = params.class ? params.class : this.classnames;
			this.checked = params.checked ? params.checked : this.checked;
		}
		this.styles = params || {};
		this._parent = parent;
		this._projector = projector;
		this.resetClickable();
		this.resetNode('checkbox');
		this.resetTransform();
	}

	public render (): VNode {
		const classes = ['checkbox', this.classnames, this.getClassname('checkbox')]
			.filter((x) => x && x.length > 0)
			.map((x) => x.toString().trim())
			.join(' ').trim();

		return h('label', {
			id: 'label_' + this.id,
			key: 'label_' + this.id,
			styles: this.getStyle(),
			class: classes
		}, [
			h('input', {
				type: 'checkbox',
				name: this.name,
				value: this.value,
				id: this.id,
				key: this.id,
				checked: this.checked,
				class: classes,
				onclick: this.click.bind(this)
			}, []),
			h('span', {}, [ this.text ])
		]);
	}
}
