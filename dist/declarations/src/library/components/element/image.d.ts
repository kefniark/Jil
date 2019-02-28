import { VNode, Projector } from 'maquette';
import { JilNode, Transform, Clickable, TransformTween } from '../../behaviours';
export interface JilImage extends JilNode, Transform, Clickable, TransformTween {
}
export declare class JilImage {
    this: any;
    src: any;
    styles: any;
    constructor(id: string, params: any, parent: JilNode, projector: Projector | undefined);
    render(): VNode;
}
