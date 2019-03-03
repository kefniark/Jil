import { use } from 'typescript-mix';
import { h, VNode, Projector } from 'maquette';
import { JilNode, Transform, TransformTween, Factory, ITransformParam } from '../../behaviours';
import { resolution } from '../../config';
import { JilPanel } from './panel';
import { JilCanvas } from './canvas';
import { JilButton, JilButtonParams } from '../element/button';
import { JilImage, JilImageParams } from '../element/image';
import { JilText, JilTextParams } from '../element/text';
import { JilRadio, JilRadioParams } from '../element/radio';
import { JilCheckbox, JilCheckboxParams } from '../element/checkbox';
import { JilSelect, JilSelectParams } from '../element/select';
import { JilInput, JilInputParams } from '../element/input';

export interface JilLayer extends JilNode, Transform, Factory, TransformTween { }

export class JilLayer {
	@use(JilNode, Transform, Factory, TransformTween) public this: any;

	constructor (id: string, params: ITransformParam, parent: JilNode, projector: Projector | undefined) {
		this.id = id;
		this._parent = parent;
		this._projector = projector;
		this.resetNode('layer');

		if (!params) params = {};
		this.resetTransform(params);

		// tslint:disable-next-line
		if (typeof(window) !== 'undefined') {
			window.addEventListener('resize', () => this.refresh(), false);
		}
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

	public render (): VNode {
		const styles = {} as any;
		styles.display = this.enable ? 'block' : 'none';
		styles.opacity = this.opacity.toString();

		// tslint:disable-next-line
		const size = (typeof(window) !== 'undefined') ? { x: window.innerWidth, y: window.innerHeight }: { x: 1, y: 1};
		const screenRatio = size.x / size.y;
		const gameRatio = resolution.x / resolution.y;
		const scaleX = size.x / resolution.x;
		const scaleY = size.y / resolution.y;
		const scale = (screenRatio <= gameRatio) ? scaleX : scaleY;

		styles.width = `${resolution.x}px`;
		styles.height = `${resolution.y}px`;
		styles.transformOrigin = 'top left';
		styles.transform = `scale(${scale})`;

		return h('div', {
			id: this.id,
			key: this.id,
			class: this.getClassnames(),
			styles
		}, this._childrens.map((x) => x.render()));
	}
}
