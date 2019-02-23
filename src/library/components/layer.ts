import { use } from 'typescript-mix';
import { Node } from '../behaviours/node';
import { Transform } from '../behaviours/transform';
import { h, VNode, Projector } from 'maquette';
import { Factory } from '../behaviours/factory';
import { TransformTween } from '../behaviours/transformTween';
import { Vector2 } from '../helpers/vector2';

// tslint:disable-next-line:interface-name
export interface Layer extends Node, Transform, Factory, TransformTween { }

export class Layer {
	@use(Node, Transform, Factory, TransformTween) public this: any;

	public resolution: Vector2;
	public classname: string;

	constructor (id: string, params: any, parent: Node, projector: Projector | undefined) {
		this.id = id;
		this.classname = params ? params : '';
		this._parent = parent;
		this._projector = projector;
		this.resolution = new Vector2(1280, 720);
		this.resetTransform();
		this.resetStyle();

		window.addEventListener('resize', this.resizeHandler.bind(this), false);
	}

	public createPanel = (id: string) => this.create('panel', id) as Node;
	public createButton = (id: string, params: string | any) => this.create('button', id, params) as Node;
	public createImage = (id: string, params: string | any) => this.create('image', id, params) as Node;
	public createText = (id: string, params: string | any) => this.create('text', id, params) as Node;

	private resizeHandler () {
		this.refresh();
	}

	public render (): VNode {
		const styles = {} as any;
		styles.display = this.enable ? 'block' : 'none';
		styles.opacity = this.opacity.toString();

		if (window.innerWidth > 0 && window.innerWidth > 0) {
			const screenRatio = window.innerWidth / window.innerHeight;
			const gameRatio = this.resolution.x / this.resolution.y;
			const scaleX = window.innerWidth / this.resolution.x;
			const scaleY = window.innerHeight / this.resolution.y;
			const scale = (screenRatio <= gameRatio) ? scaleX : scaleY;

			styles.width = `${this.resolution.x}px`;
			styles.height = `${this.resolution.y}px`;
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
