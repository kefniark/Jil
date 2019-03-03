import { VNode, Projector } from 'maquette';
import { JilNode, Transform, Clickable, Factory, ITransformParam, KeyboardEvents } from '../../behaviours';
export interface JilRadio extends JilNode, Factory, Transform, Clickable, KeyboardEvents {
}
export interface JilRadioParams extends ITransformParam {
    name?: string;
    value?: string;
    text?: string;
    checked?: boolean;
}
export declare class JilRadio {
    this: any;
    name: any;
    value: any;
    text: any;
    checked: boolean;
    constructor(id: string, params: JilRadioParams, parent: JilNode, projector: Projector | undefined);
    render(): VNode;
}
