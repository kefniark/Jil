import { use } from 'typescript-mix';
import { h, VNode, Projector } from 'maquette';
import { JilNode, Transform, TransformTween, Factory, ITransformParam } from '../../behaviours';
import { isString, shuffleArray, getParam } from '../../helpers';
import { JilTextCharacter, TextAnimationAnim } from './textCharacter';

/**
 * @ignore
 */
export const enum TextAnimationOrder {
	Order = 'order',
	Reverse = 'reverse',
	Shuffle = 'shuffle'
}

/**
 * @ignore
 */
export const enum TextAnimationSplit {
	Character = 'character',
	Word = 'word',
	All = 'all'
}

export interface TextAnimationParam {
	split?: TextAnimationSplit;
	order?: TextAnimationOrder;
	anim?: TextAnimationAnim;
	delay?: number;
	duration?: number;
}

export interface JilText extends JilNode, Factory, Transform, TransformTween { }

/**
 * @ignore
 */
export interface JilTextParams extends ITransformParam {
	text?: string;
}

export class JilText {
	@use(JilNode, Factory, Transform, TransformTween) public this: any;

	public text: string;

	constructor (id: string, params: JilTextParams, parent: JilNode, projector: Projector | undefined) {
		this.id = id;
		this._parent = parent;
		this._projector = projector;
		this.resetNode('text');

		if (!params) params = {};
		this.resetTransform(params);

		this.text = isString(params) ? params : getParam(params, 'text', 'Default Text');
	}

	// tslint:disable-next-line:max-line-length
	public createCharacter = (id: string, params?: string | any) => {
		return this.createComponent('character', id, params) as JilTextCharacter;
	}

	public animate (text: string, params: TextAnimationParam) {
		if (!params) params = {};
		this.removeAllChilds();
		this.text = text;

		const splitParam = params.split || TextAnimationSplit.Word;
		const split = splitParam === TextAnimationSplit.All ? [ text ] : text.split(' ');

		let characters: JilTextCharacter[] = [];
		for (let i = 0; i < split.length; i++) {
			if (splitParam === TextAnimationSplit.Character) {
				let j = 0;
				split[i].split('').forEach((x) => {
					characters.push(this.createCharacter(`${this.id}_${i}_${j}`, {
						text: x,
						class: 'text-span'
					}));
					j++;
				});
			} else {
				characters.push(this.createCharacter(`${this.id}_${i}`, {
					text: split[i],
					class: 'text-span'
				}));
			}

			if (i < split.length) {
				this.createCharacter(`${this.id}_${i}`, {
					text: ' ',
					class: 'text-span-space'
				});
			}
		}

		const order = params.order || TextAnimationOrder.Order;
		switch (order) {
		case TextAnimationOrder.Reverse:
			characters = characters.reverse();
			break;
		case TextAnimationOrder.Shuffle:
			characters = shuffleArray(characters);
			break;
		}

		const anim = params.anim || TextAnimationAnim.Fade;
		const delay = params.delay || 30;
		const duration = params.duration || 350;
		for (let i = 0; i < characters.length; i++) {
			characters[i].animation(anim, delay * i, duration);
		}
	}

	public render (): VNode {
		const vnodes = this._childrens.length > 0 ? this._childrens.map((x) => x.render()) : [ this.text ];
		return h('div', this.getProperties({}), vnodes);
	}
}
