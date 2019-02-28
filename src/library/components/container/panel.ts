import { use } from 'typescript-mix';
import { h, VNode, Projector } from 'maquette';
import { JilNode, Transform, TransformTween, Factory, Layout } from '../../behaviours';
import { JilCanvas } from './canvas';
import { JilButton } from '../element/button';
import { JilImage } from '../element/image';
import { JilText } from '../element/text';

// tslint:disable-next-line:interface-name
export interface JilPanel extends JilNode, Transform, Factory, TransformTween, Layout { }

export class JilPanel {
	@use(JilNode, Transform, Factory, TransformTween, Layout) public this: any;

	constructor (id: string, params: any, parent: JilNode, projector: Projector | undefined) {
		this.id = id;
		this._parent = parent;
		this._projector = projector;
		this.resetNode('panel');
		this.resetTransform();
		this.resetLayout();
	}

	public render (): VNode {
		return h('div', {
			id: this.id,
			key: this.id,
			class: 'panel',
			styles: this.getStyle()
		}, this._childrens.map((x) => x.render()));
	}

	public createPanel = (id: string) => this.createComponent('panel', id) as JilPanel;
	public createButton = (id: string, params?: string | any) => this.createComponent('button', id, params) as JilButton;
	public createImage = (id: string, params?: string | any) => this.createComponent('image', id, params) as JilImage;
	public createText = (id: string, params?: string | any) => this.createComponent('text', id, params) as JilText;
	public createCanvas = (id: string, params?: string | any) => this.createComponent('canvas', id, params) as JilCanvas;

	public refreshLayout () {
		const layoutMethod = this.getLayout(this.layout);
		if (layoutMethod) {
			layoutMethod(this, this._childrens);
		}
	}
}
