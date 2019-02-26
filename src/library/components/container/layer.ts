import { use } from 'typescript-mix';
import { h, VNode, Projector } from 'maquette';
import { Node, Transform, TransformTween, Factory } from '../../behaviours';
import { resolution } from '../../config';
import { JilPanel } from './panel';
import { JilCanvas } from './canvas';
import { JilButton } from '../element/button';
import { JilImage } from '../element/image';
import { JilText } from '../element/text';

// tslint:disable-next-line:interface-name
export interface JilLayer extends Node, Transform, Factory, TransformTween { }

export class JilLayer {
	@use(Node, Transform, Factory, TransformTween) public this: any;

	public classname: string;

	constructor (id: string, params: any, parent: Node, projector: Projector | undefined) {
		this.id = id;
		this.classname = params ? params : '';
		this._parent = parent;
		this._projector = projector;
		this.resetTransform();
		this.resetStyle();

		// tslint:disable-next-line
		if (typeof(window) !== 'undefined') {
			window.addEventListener('resize', this.resizeHandler.bind(this), false);
		}
	}

	public createPanel = (id: string) => this.create('panel', id) as JilPanel;
	public createButton = (id: string, params?: string | any) => this.create('button', id, params) as JilButton;
	public createImage = (id: string, params?: string | any) => this.create('image', id, params) as JilImage;
	public createText = (id: string, params?: string | any) => this.create('text', id, params) as JilText;
	public createCanvas = (id: string, params?: string | any) => this.create('canvas', id, params) as JilCanvas;

	private resizeHandler () {
		this.refresh();
	}

	public render (): VNode {
		const styles = {} as any;
		styles.display = this.enable ? 'block' : 'none';
		styles.opacity = this.opacity.toString();

		// tslint:disable-next-line
		if ((typeof(window) !== 'undefined') && window.innerWidth > 0 && window.innerWidth > 0) {
			const screenRatio = window.innerWidth / window.innerHeight;
			const gameRatio = resolution.x / resolution.y;
			const scaleX = window.innerWidth / resolution.x;
			const scaleY = window.innerHeight / resolution.y;
			const scale = (screenRatio <= gameRatio) ? scaleX : scaleY;

			styles.width = `${resolution.x}px`;
			styles.height = `${resolution.y}px`;
			styles.transformOrigin = 'top left';
			styles.transform = `scale(${scale})`;
		}

		return h('div', {
			id: this.id,
			key: this.id,
			class: `layer ${this.classname}`.trim(),
			styles
		}, this._childrens.map((x) => x.render()));
	}
}
