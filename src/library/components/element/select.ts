import { use } from 'typescript-mix';
import { h, VNode, Projector } from 'maquette';
import { JilNode, Transform, Clickable, Factory } from '../../behaviours';

export interface IJilSelectOption {
	text: string;
	value: string;
}

// tslint:disable-next-line:interface-name
export interface JilSelect extends JilNode, Factory, Transform, Clickable { }

export class JilSelect {
	@use(JilNode, Factory, Transform, Clickable) public this: any;

	public name;
	public value;
	public styles;
	public options: IJilSelectOption[];
	public classnames: string;

	constructor (id: string, params: any, parent: JilNode, projector: Projector | undefined) {
		this.id = id;
		this.name = 'select';
		this.value = '';
		this.classnames = '';
		this.options = [];
		if (params) {
			this.name = params.name ? params.name : this.name;
			this.value = params.value ? params.value : this.value;
			this.classnames = params.class ? params.class : this.classnames;
			this.options = params.options ? params.options : this.options;
		}
		this.styles = params || {};
		this._parent = parent;
		this._projector = projector;
		this.resetClickable();
		this.resetNode('radio');
		this.resetTransform();
	}

	public render (): VNode {
		const classes = ['select', this.classnames, this.getClassname('select')]
			.filter((x) => x && x.length > 0)
			.map((x) => x.toString().trim())
			.join(' ').trim();

		const val = !this.value && this.options.length > 0 ? this.options[0].value : this.value;
		return h('select', {
			id: this.id,
			key: this.id,
			name: this.name,
			value: val,
			styles: this.getStyle(),
			class: classes,
			onclick: this.click.bind(this)
		}, this.options.map((x) => {
			return h('option', { value: x.value }, [ x.text ]);
		}));
	}
}
