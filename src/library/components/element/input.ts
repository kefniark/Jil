import { use } from 'typescript-mix';
import { h, VNode, Projector } from 'maquette';
import { JilNode, Transform, Clickable, Factory } from '../../behaviours';

// tslint:disable-next-line:interface-name
export interface JilInput extends JilNode, Factory, Transform, Clickable { }

export class JilInput {
	@use(JilNode, Factory, Transform, Clickable) public this: any;

	public name;
	public value;
	public styles;
	public classnames: string;

	constructor (id: string, params: any, parent: JilNode, projector: Projector | undefined) {
		this.id = id;
		this.name = 'input';
		this.value = 'value';
		this.classnames = '';
		if (params) {
			this.name = params.name ? params.name : this.name;
			this.value = params.value ? params.value : this.value;
			this.classnames = params.class ? params.class : this.classnames;
		}
		this.styles = params || {};
		this._parent = parent;
		this._projector = projector;
		this.resetClickable();
		this.resetNode('radio');
		this.resetTransform();
	}

	public render (): VNode {
		const classes = ['input', this.classnames, this.getClassname('input')]
			.filter((x) => x && x.length > 0)
			.map((x) => x.toString().trim())
			.join(' ').trim();

		return h('input', {
			id: this.id,
			key: this.id,
			name: this.name,
			value: this.value,
			styles: this.getStyle(),
			class: classes,
			onclick: this.click.bind(this)
		}, []);
	}
}
