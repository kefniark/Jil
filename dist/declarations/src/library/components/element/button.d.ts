import { VNode, Projector } from 'maquette';
import { JilNode, Transform, Clickable, TransformTween } from '../../behaviours';
export interface JilButton extends JilNode, Transform, Clickable, TransformTween {
}
export declare class JilButton {
    this: any;
    text: any;
    constructor(id: string, params: any, parent: JilNode, projector: Projector | undefined);
    render(): VNode;
}
