import { VNode, Projector } from 'maquette';
import { JilNode, Transform, TransformTween, Factory } from '../../behaviours';
import { JilTextCharacter, TextAnimationAnim } from './textCharacter';
export declare const enum TextAnimationOrder {
    Order = "order",
    Reverse = "reverse",
    Shuffle = "shuffle"
}
export declare const enum TextAnimationSplit {
    Character = "character",
    Word = "word",
    All = "all"
}
export interface ITextAnimationParam {
    split?: TextAnimationSplit;
    order?: TextAnimationOrder;
    anim?: TextAnimationAnim;
    delay?: number;
    duration?: number;
}
export interface JilText extends JilNode, Factory, Transform, TransformTween {
}
export declare class JilText {
    this: any;
    text: string;
    styles: any;
    classnames: string;
    constructor(id: string, params: any, parent: JilNode, projector: Projector | undefined);
    createCharacter: (id: string, params?: any) => JilTextCharacter;
    animate(text: string, params: ITextAnimationParam): void;
    render(): VNode;
}
