import { VNode, Projector } from 'maquette';
import { JilNode, Transform, Clickable, TransformTween, Factory } from '../../behaviours';
export interface JilButton extends JilNode, Factory, Transform, Clickable, TransformTween {
}
export declare class JilButton {
    this: any;
    text: any;
    styles: any;
    classnames: string;
    constructor(id: string, params: any, parent: JilNode, projector: Projector | undefined);
    render(): VNode;
}
