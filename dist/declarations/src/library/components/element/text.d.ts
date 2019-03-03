import { VNode, Projector } from 'maquette';
import { JilNode, Transform, TransformTween, Factory, ITransformParam } from '../../behaviours';
import { JilTextCharacter, TextAnimationAnim } from './textCharacter';
/**
 * @ignore
 */
export declare const enum TextAnimationOrder {
    Order = "order",
    Reverse = "reverse",
    Shuffle = "shuffle"
}
/**
 * @ignore
 */
export declare const enum TextAnimationSplit {
    Character = "character",
    Word = "word",
    All = "all"
}
export interface TextAnimationParam {
    split?: TextAnimationSplit;
    order?: TextAnimationOrder;
    anim?: TextAnimationAnim;
    delay?: number;
    duration?: number;
}
export interface JilText extends JilNode, Factory, Transform, TransformTween {
}
/**
 * @ignore
 */
export interface JilTextParams extends ITransformParam {
    text?: string;
}
export declare class JilText {
    this: any;
    text: string;
    constructor(id: string, params: JilTextParams, parent: JilNode, projector: Projector | undefined);
    createCharacter: (id: string, params?: any) => JilTextCharacter;
    animate(text: string, params: TextAnimationParam): void;
    render(): VNode;
}
