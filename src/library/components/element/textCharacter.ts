
import * as Fatina from 'fatina';
import { use } from 'typescript-mix';
import { h, VNode, Projector } from 'maquette';
import { JilNode, Transform, ITransformParam } from '../../behaviours';
import { getComponent, isString, getParam } from '../../helpers';

export interface JilTextCharacter extends JilNode, Transform { }

/**
 * @ignore
 */
export const enum TextAnimationAnim {
	Fade = 'fade',
	Zoom = 'zoom'
}

/**
 * @ignore
 */
export interface JilTextCharacterParams extends ITransformParam {
	text?: string;
}

/**
 * @ignore
 */
export class JilTextCharacter {
	@use(JilNode, Transform) public this: any;

	public text: string;

	constructor (id: string, params: JilTextCharacterParams, parent: JilNode, projector: Projector | undefined) {
		this.id = id;
		this._parent = parent;
		this._projector = projector;
		this.resetNode('character');

		if (!params) params = {};
		this.resetTransform(params);

		this.text = isString(params) ? params : getParam(params, 'text', 'text');
	}

	private tween (obj: any, data: any, duration: number, delay: number) {
		const node = getComponent<JilNode>(this);
		const tween = Fatina.tween(obj)
			.to(data, duration)
			.setEasing(Fatina.EasingType.InOutQuad)
			.toSequence().prependInterval(delay);

		tween.onUpdate(() => node.refresh());
		tween.start();
	}

	public animation (anim: TextAnimationAnim, delay: number, duration: number) {
		switch (anim) {
		case TextAnimationAnim.Fade:
			this.opacity = 0;
			this.tween(this, { opacity: 1 }, duration, delay);
			break;
		case TextAnimationAnim.Zoom:
			this.scale.set(0, 0);
			this.tween(this.scale, { x: 1, y: 1 }, duration, delay);
			break;
		}
	}

	public render (): VNode {
		const x = ((this.anchor.x / this.size.x) - this.pivot.x + (this.position.x / this.size.x)) * 100;
		const y = ((this.anchor.y / this.size.y) - this.pivot.y + (this.position.y / this.size.y)) * 100;
		let transform = '';

		if (x !== 0 || y !== 0) {
			transform += `translate(${x}%, ${y}%) `;
		}

		if (this.scale.x !== 1 || this.scale.y !== 1) {
			transform += `scale(${this.scale.x}, ${this.scale.y}) `;
		}

		if (this.rotation !== 0) {
			transform += `rotate(${this.rotation}deg)`;
		}

		let filter = '';
		if (this.blur !== 0) {
			filter += `blur(${this.blur}px) `;
		}

		return h('span', {
			id: this.id,
			key: this.id,
			class: this.classnames,
			styles: {
				opacity: this.opacity.toString(),
				transform,
				filter
			}
		}, [ this.text ]);
	}
}
