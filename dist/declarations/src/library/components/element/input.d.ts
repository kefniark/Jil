import { VNode, Projector } from 'maquette';
import { JilNode, Transform, Clickable, Factory, ITransformParam, KeyboardEvents } from '../../behaviours';
export interface JilInput extends JilNode, Factory, Transform, Clickable, KeyboardEvents {
}
export interface JilInputParams extends ITransformParam {
    name?: string;
    value?: string;
}
export declare class JilInput {
    this: any;
    name: any;
    value: any;
    constructor(id: string, params: JilInputParams, parent: JilNode, projector: Projector | undefined);
    render(): VNode;
}
