import { use } from 'typescript-mix';
import { h, VNode, Projector } from 'maquette';
import { JilNode, Transform, TransformTween, Factory } from '../../behaviours';
import { resolution } from '../../config';
import { JilPanel } from './panel';
import { JilCanvas } from './canvas';
import { JilButton } from '../element/button';
import { JilImage } from '../element/image';
import { JilText } from '../element/text';
import { JilRadio } from '../element/radio';
import { JilCheckbox } from '../element/checkbox';
import { JilSelect } from '../element/select';
import { JilInput } from '../element/input';

// tslint:disable-next-line:interface-name
export interface JilLayer extends JilNode, Transform, Factory, TransformTween { }

export class JilLayer {
	@use(JilNode, Transform, Factory, TransformTween) public this: any;

	public classname: string;

	constructor (id: string, params: any, parent: JilNode, projector: Projector | undefined) {
		this.id = id;
		this.classname = params ? params : '';
		this._parent = parent;
		this._projector = projector;
		this.resetNode('layer');
		this.resetTransform();

		// tslint:disable-next-line
		if (typeof(window) !== 'undefined') {
			window.addEventListener('resize', () => this.refresh(), false);
		}
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
			class: `layer ${this.classname}`.trim(),
			styles
		}, this._childrens.map((x) => x.render()));
	}
}
