import { VNode, Projector } from 'maquette';
import { JilNode, Transform, Clickable, TransformTween, Factory } from '../../behaviours';
export interface JilImage extends JilNode, Factory, Transform, Clickable, TransformTween {
}
export declare class JilImage {
    this: any;
    src: any;
    styles: any;
    classnames: string;
    constructor(id: string, params: any, parent: JilNode, projector: Projector | undefined);
    render(): VNode;
}
