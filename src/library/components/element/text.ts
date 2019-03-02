import { use } from 'typescript-mix';
import { h, VNode, Projector } from 'maquette';
import { JilNode, Transform, TransformTween, Factory } from '../../behaviours';
import { isString } from '../../helpers';
import { JilTextCharacter, TextAnimationAnim } from './textCharacter';
import { shuffleArray } from '../../helpers/helpers';

export const enum TextAnimationOrder {
	Order = 'order',
	Reverse = 'reverse',
	Shuffle = 'shuffle'
}

export const enum TextAnimationSplit {
	Character = 'character',
	Word = 'word',
	All = 'all'
}

export interface ITextAnimationParam {
	split?: TextAnimationSplit;
	order?: TextAnimationOrder;
	anim?: TextAnimationAnim;
	delay?: number;
	duration?: number;
}

// tslint:disable-next-line:interface-name
export interface JilText extends JilNode, Factory, Transform, TransformTween { }

export class JilText {
	@use(JilNode, Factory, Transform, TransformTween) public this: any;

	public text: string;
	public styles;
	public classnames: string;

	constructor (id: string, params: any, parent: JilNode, projector: Projector | undefined) {
		this.id = id;
		this.text = 'Default Text';
		this.classnames = '';
		if (params) {
			if (isString(params)) {
				this.text = params;
			} else {
				this.text = params.text;
				this.classnames = params.class;
			}
		}
		this.styles = params || {};
		this._parent = parent;
		this._projector = projector;
		this.resetNode('text');
		this.resetTransform();
	}

	// tslint:disable-next-line:max-line-length
	public createCharacter = (id: string, params?: string | any) => {
		return this.createComponent('character', id, params) as JilTextCharacter;
	}

	public animate (text: string, params: ITextAnimationParam) {
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
		const classes = ['text', this.classnames, this.getClassname('text')]
			.filter((x) => x && x.length > 0)
			.map((x) => x.toString().trim())
			.join(' ').trim();

		return h('div', {
			id: this.id,
			key: this.id,
			class: classes,
			styles: this.styles ? Object.assign(this.getStyle(), this.styles) : this.getStyle()
		}, vnodes);
	}
}
