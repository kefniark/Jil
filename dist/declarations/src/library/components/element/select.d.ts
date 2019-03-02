import { VNode, Projector } from 'maquette';
import { JilNode, Transform, Clickable, Factory } from '../../behaviours';
export interface IJilSelectOption {
    text: string;
    value: string;
}
export interface JilSelect extends JilNode, Factory, Transform, Clickable {
}
export declare class JilSelect {
    this: any;
    name: any;
    value: any;
    styles: any;
    options: IJilSelectOption[];
    classnames: string;
    constructor(id: string, params: any, parent: JilNode, projector: Projector | undefined);
    render(): VNode;
}
