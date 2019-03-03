import { JilNode, Transform, Factory, ITransformParam } from '../../behaviours';
import { Projector, VNode } from 'maquette';
export interface JilAlert extends JilNode, Transform, Factory {
}
/**
 * @ignore
 */
export interface JilAlertParams extends ITransformParam {
    title?: string;
    content?: string;
}
export declare class JilAlert {
    this: any;
    title: string;
    content: string;
    private okButton;
    private clickEvent;
    constructor(id: string, params: ITransformParam, parent: JilNode, projector: Projector | undefined);
    onClick(cb: () => void): void;
    private createButton;
    render(): VNode;
}
