import { VNode, Projector } from 'maquette';
import { JilNode, Transform, Clickable, TransformTween, Factory, ITransformParam, KeyboardEvents } from '../../behaviours';
export interface JilButton extends JilNode, Factory, Transform, Clickable, KeyboardEvents, TransformTween {
}
export interface JilButtonParams extends ITransformParam {
    text?: string;
}
export declare class JilButton {
    this: any;
    text: any;
    constructor(id: string, params: JilButtonParams, parent: JilNode, projector: Projector | undefined);
    render(): VNode;
}
