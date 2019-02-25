import { VNode, Projector } from 'maquette';
import { Node, Transform, Clickable, TransformTween } from '../../behaviours';
export interface JilButton extends Node, Transform, Clickable, TransformTween {
}
export declare class JilButton {
    this: any;
    text: any;
    constructor(id: string, params: any, parent: Node, projector: Projector | undefined);
    render(): VNode;
}
