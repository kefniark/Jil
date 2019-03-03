import { use } from 'typescript-mix';
import { h, VNode, Projector } from 'maquette';
import { JilNode, Transform, Clickable, TransformTween, MouseEvents } from '../../behaviours';
import { resolution } from '../../config';
import { TransformParam } from '../../behaviours/core/transform';

export interface JilCanvas extends JilNode, Transform, Clickable, MouseEvents, TransformTween { }

export class JilCanvas {
	@use(JilNode, Transform, Clickable, MouseEvents, TransformTween) public this: any;

	constructor (id: string, params: TransformParam, parent: JilNode, projector: Projector | undefined) {
		this.id = id;
		this._parent = parent;
		this._projector = projector;
		this.resetClickable();
		this.resetMouseEvent();
		this.resetNode('canvas');

		if (!params) params = {};
		this.resetTransform(params);
	}

	public render (): VNode {
		return h('canvas', this.getProperties({
			width: resolution.x,
			height: resolution.y
		}));
	}
}
