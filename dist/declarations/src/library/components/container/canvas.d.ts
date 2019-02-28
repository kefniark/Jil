import { VNode, Projector } from 'maquette';
import { JilNode, Transform, Clickable, TransformTween } from '../../behaviours';
export interface JilCanvas extends JilNode, Transform, Clickable, TransformTween {
}
export declare class JilCanvas {
    this: any;
    constructor(id: string, params: any, parent: JilNode, projector: Projector | undefined);
    render(): VNode;
}
