import { VNode, Projector } from 'maquette';
import { JilNode, Transform, Clickable, Factory, ITransformParam, KeyboardEvents } from '../../behaviours';
export interface JilSelect extends JilNode, Factory, Transform, Clickable, KeyboardEvents {
}
/**
 * @ignore
 */
export interface JilSelectParams extends ITransformParam {
    name?: string;
    value?: string;
    options?: JilSelectOption[];
}
export interface JilSelectOption {
    text: string;
    value: string;
}
export declare class JilSelect {
    this: any;
    name: any;
    value: any;
    options: JilSelectOption[];
    constructor(id: string, params: JilSelectParams, parent: JilNode, projector: Projector | undefined);
    render(): VNode;
}
