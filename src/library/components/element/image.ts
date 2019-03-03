import { use } from 'typescript-mix';
import { h, VNode, Projector } from 'maquette';
import { JilNode, Transform, Clickable, TransformTween, Factory, ITransformParam, MouseEvents } from '../../behaviours';
import { isString, getParam } from '../../helpers';

export interface JilImage extends JilNode, Factory, Transform, Clickable, MouseEvents, TransformTween { }

export interface JilImageParams extends ITransformParam {
	src?: string;
}

export class JilImage {
	@use(JilNode, Factory, Transform, Clickable, MouseEvents, TransformTween) public this: any;

	public src;

	constructor (id: string, params: JilImageParams, parent: JilNode, projector: Projector | undefined) {
		this.id = id;
		this._parent = parent;
		this._projector = projector;
		this.resetClickable();
		this.resetMouseEvent();
		this.resetNode('image');

		if (!params) params = {};
		this.resetTransform(params);

		this.src = isString(params) ? params : getParam(params, 'src', '');
	}

	public render (): VNode {
		return h('img', this.getProperties({ src: this.src }), []);
	}
}
