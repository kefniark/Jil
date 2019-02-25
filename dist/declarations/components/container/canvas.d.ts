import { VNode, Projector } from 'maquette';
import { Node, Transform, Clickable, TransformTween } from '../../behaviours';
export interface JilCanvas extends Node, Transform, Clickable, TransformTween {
}
export declare class JilCanvas {
    this: any;
    constructor(id: string, params: any, parent: Node, projector: Projector | undefined);
    render(): VNode;
}
