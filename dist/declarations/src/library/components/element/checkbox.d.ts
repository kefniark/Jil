import { VNode, Projector } from 'maquette';
import { JilNode, Transform, Clickable, Factory, ITransformParam, KeyboardEvents } from '../../behaviours';
export interface JilCheckbox extends JilNode, Factory, Transform, Clickable, KeyboardEvents {
}
export interface JilCheckboxParams extends ITransformParam {
    name?: string;
    value?: string;
    text?: string;
    checked?: boolean;
}
export declare class JilCheckbox {
    this: any;
    name: any;
    value: any;
    text: any;
    checked: boolean;
    constructor(id: string, params: JilCheckboxParams, parent: JilNode, projector: Projector | undefined);
    render(): VNode;
}
