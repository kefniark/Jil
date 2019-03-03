import { VNode, Projector } from 'maquette';
import { JilNode, Transform, Clickable, TransformTween, MouseEvents } from '../../behaviours';
import { TransformParam } from '../../behaviours/core/transform';
export interface JilCanvas extends JilNode, Transform, Clickable, MouseEvents, TransformTween {
}
export declare class JilCanvas {
    this: any;
    constructor(id: string, params: TransformParam, parent: JilNode, projector: Projector | undefined);
    render(): VNode;
}
