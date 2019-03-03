import { VNode, Projector } from 'maquette';
import { JilNode, Transform, ITransformParam } from '../../behaviours';
export interface JilTextCharacter extends JilNode, Transform {
}
/**
 * @ignore
 */
export declare const enum TextAnimationAnim {
    Fade = "fade",
    Zoom = "zoom"
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
export declare class JilTextCharacter {
    this: any;
    text: string;
    constructor(id: string, params: JilTextCharacterParams, parent: JilNode, projector: Projector | undefined);
    private tween;
    animation(anim: TextAnimationAnim, delay: number, duration: number): void;
    render(): VNode;
}
