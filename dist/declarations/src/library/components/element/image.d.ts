import { VNode, Projector } from 'maquette';
import { JilNode, Transform, Clickable, TransformTween, Factory, ITransformParam, MouseEvents } from '../../behaviours';
export interface JilImage extends JilNode, Factory, Transform, Clickable, MouseEvents, TransformTween {
}
export interface JilImageParams extends ITransformParam {
    src?: string;
}
export declare class JilImage {
    this: any;
    src: any;
    constructor(id: string, params: JilImageParams, parent: JilNode, projector: Projector | undefined);
    render(): VNode;
}
