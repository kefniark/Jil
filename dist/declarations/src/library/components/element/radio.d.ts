import { VNode, Projector } from 'maquette';
import { JilNode, Transform, Clickable, Factory } from '../../behaviours';
export interface JilRadio extends JilNode, Factory, Transform, Clickable {
}
export declare class JilRadio {
    this: any;
    name: any;
    value: any;
    text: any;
    styles: any;
    classnames: string;
    checked: boolean;
    constructor(id: string, params: any, parent: JilNode, projector: Projector | undefined);
    render(): VNode;
}
