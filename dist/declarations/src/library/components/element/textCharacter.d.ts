import { VNode, Projector } from 'maquette';
import { JilNode, Transform } from '../../behaviours';
export interface JilTextCharacter extends JilNode, Transform {
}
export declare const enum TextAnimationAnim {
    Fade = "fade",
    Zoom = "zoom"
}
export declare class JilTextCharacter {
    this: any;
    text: string;
    classname: any;
    constructor(id: string, params: any, parent: JilNode, projector: Projector | undefined);
    private tween;
    animation(anim: TextAnimationAnim, delay: number, duration: number): void;
    render(): VNode;
}
