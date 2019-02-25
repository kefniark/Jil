import { VNode, Projector } from 'maquette';
import { Node, Transform, TransformTween } from '../../behaviours';
export interface JilText extends Node, Transform, TransformTween {
}
export declare class JilText {
    this: any;
    text: any;
    styles: any;
    constructor(id: string, params: any, parent: Node, projector: Projector | undefined);
    render(): VNode;
}
