import { use } from 'typescript-mix';
import { h, VNode, Projector } from 'maquette';
import { JilNode, Transform, TransformTween, Factory, Layout } from '../../behaviours';
import { JilCanvas } from './canvas';
import { JilButton } from '../element/button';
import { JilImage } from '../element/image';
import { JilText } from '../element/text';
import { JilRadio } from '../element/radio';
import { JilCheckbox } from '../element/checkbox';
import { JilSelect } from '../element/select';
import { JilInput } from '../element/input';

// tslint:disable-next-line:interface-name
export interface JilPanel extends JilNode, Transform, Factory, TransformTween, Layout { }

export class JilPanel {
	@use(JilNode, Transform, Factory, TransformTween, Layout) public this: any;

	public classnames: string;

	constructor (id: string, params: any, parent: JilNode, projector: Projector | undefined) {
		this.id = id;
		this.classnames = '';
		if (params) {
			this.classnames = params.class ? params.class : this.classnames;
		}
		this._parent = parent;
		this._projector = projector;
		this.resetNode('panel');
		this.resetTransform();
		this.resetLayout();
	}

	public createPanel = (id: string, params?: string | any) => this.createComponent('panel', id, params) as JilPanel;
	public createButton = (id: string, params?: string | any) => this.createComponent('button', id, params) as JilButton;
	public createImage = (id: string, params?: string | any) => this.createComponent('image', id, params) as JilImage;
	public createText = (id: string, params?: string | any) => this.createComponent('text', id, params) as JilText;
	public createCanvas = (id: string, params?: string | any) => this.createComponent('canvas', id, params) as JilCanvas;
	public createRadio = (id: string, params?: string | any) => this.createComponent('radio', id, params) as JilRadio;
	public createCheckbox = (id: string, params?: string | any) => this.createComponent('checkbox', id, params) as JilCheckbox;
	public createSelect = (id: string, params?: string | any) => this.createComponent('select', id, params) as JilSelect;
	public createInput = (id: string, params?: string | any) => this.createComponent('input', id, params) as JilInput;

	public refreshLayout () {
		const layoutMethod = this.getLayout(this.layout);
		if (layoutMethod) {
			layoutMethod(this, this._childrens);
		}
	}

	public render (): VNode {
		const classes = ['panel', this.classnames, this.getClassname('panel')]
			.filter((x) => x && x.length > 0)
			.map((x) => x.toString().trim())
			.join(' ').trim();

		return h('div', {
			id: this.id,
			key: this.id,
			class: classes,
			styles: this.getStyle()
		}, this._childrens.map((x) => x.render()));
	}
}
