import { VNode, Projector } from 'maquette';
import { JilNode, Transform, TransformTween } from '../../behaviours';
export interface JilText extends JilNode, Transform, TransformTween {
}
export declare class JilText {
    this: any;
    text: any;
    styles: any;
    constructor(id: string, params: any, parent: JilNode, projector: Projector | undefined);
    render(): VNode;
}
