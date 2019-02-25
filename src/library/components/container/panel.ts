import { use } from 'typescript-mix';
import { h, VNode, Projector } from 'maquette';
import { Node, Transform, TransformTween, Factory } from '../../behaviours';
import { JilCanvas } from './canvas';
import { JilButton } from '../element/button';
import { JilImage } from '../element/image';
import { JilText } from '../element/text';

// tslint:disable-next-line:interface-name
export interface JilPanel extends Node, Transform, Factory, TransformTween { }

export class JilPanel {
	@use(Node, Transform, Factory, TransformTween) public this: any;

	constructor (id: string, params: any, parent: Node, projector: Projector | undefined) {
		this.id = id;
		this._parent = parent;
		this._projector = projector;
		this.resetTransform();
		this.resetStyle();
	}

	public render (): VNode {
		return h('div', {
			id: this.id,
			key: this.id,
			class: 'panel',
			styles: this.getStyle()
		}, this._childrens.map((x) => x.render()));
	}

	public createPanel = (id: string) => this.create('panel', id) as JilPanel;
	public createButton = (id: string, params: string | any) => this.create('button', id, params) as JilButton;
	public createImage = (id: string, params: string | any) => this.create('image', id, params) as JilImage;
	public createText = (id: string, params: string | any) => this.create('text', id, params) as JilText;
	public createCanvas = (id: string, params: string | any) => this.create('canvas', id, params) as JilCanvas;
}
