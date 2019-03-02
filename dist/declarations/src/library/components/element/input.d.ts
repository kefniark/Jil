import { VNode, Projector } from 'maquette';
import { JilNode, Transform, Clickable, Factory } from '../../behaviours';
export interface JilInput extends JilNode, Factory, Transform, Clickable {
}
export declare class JilInput {
    this: any;
    name: any;
    value: any;
    styles: any;
    classnames: string;
    constructor(id: string, params: any, parent: JilNode, projector: Projector | undefined);
    render(): VNode;
}
