import { VNode, Projector } from 'maquette';
import { Node, Transform, Clickable, TransformTween } from '../../behaviours';
export interface JilImage extends Node, Transform, Clickable, TransformTween {
}
export declare class JilImage {
    this: any;
    src: any;
    styles: any;
    constructor(id: string, params: any, parent: Node, projector: Projector | undefined);
    render(): VNode;
}
