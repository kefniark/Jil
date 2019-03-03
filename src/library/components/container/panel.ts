import { use } from 'typescript-mix';
import { h, VNode, Projector } from 'maquette';
import { JilNode, Transform, TransformTween, Factory, Layout, ITransformParam } from '../../behaviours';
import { JilCanvas } from './canvas';
import { JilButton, JilButtonParams } from '../element/button';
import { JilImage, JilImageParams } from '../element/image';
import { JilText, JilTextParams } from '../element/text';
import { JilRadio, JilRadioParams } from '../element/radio';
import { JilCheckbox, JilCheckboxParams } from '../element/checkbox';
import { JilSelect, JilSelectParams } from '../element/select';
import { JilInput, JilInputParams } from '../element/input';

export interface JilPanel extends JilNode, Transform, Factory, TransformTween, Layout { }

export class JilPanel {
	@use(JilNode, Transform, Factory, TransformTween, Layout) public this: any;

	constructor (id: string, params: ITransformParam, parent: JilNode, projector: Projector | undefined) {
		this.id = id;
		this._parent = parent;
		this._projector = projector;
		this.resetNode('panel');

		if (!params) params = {};
		this.resetTransform(params);
		this.resetLayout();
	}

	public createCanvas = (id: string, params?: ITransformParam) => this.createComponent('canvas', id, params) as JilCanvas;
	public createPanel = (id: string, params?: ITransformParam) => this.createComponent('panel', id, params) as JilPanel;

	public createButton = (id: string, params?: string | JilButtonParams) => this.createComponent('button', id, params) as JilButton;
	public createCheckbox = (id: string, params?: JilCheckboxParams) => this.createComponent('checkbox', id, params) as JilCheckbox;
	public createImage = (id: string, params?: string | JilImageParams) => this.createComponent('image', id, params) as JilImage;
	public createInput = (id: string, params?: string | JilInputParams) => this.createComponent('input', id, params) as JilInput;
	public createRadio = (id: string, params?: JilRadioParams) => this.createComponent('radio', id, params) as JilRadio;
	public createSelect = (id: string, params?: JilSelectParams) => this.createComponent('select', id, params) as JilSelect;
	public createText = (id: string, params?: string | JilTextParams) => this.createComponent('text', id, params) as JilText;

	public refreshLayout () {
		const layoutMethod = this.getLayout(this.layout);
		if (layoutMethod) {
			layoutMethod(this, this._childrens);
		}
	}

	public render (): VNode {
		return h('div', {
			id: this.id,
			key: this.id,
			class: this.getClassnames(),
			styles: this.getStyle()
		}, this._childrens.map((x) => x.render()));
	}
}
