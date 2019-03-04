import { JilNode, Transform, Factory, ITransformParam } from '../../behaviours';
import { Projector, VNode } from 'maquette';
export interface JilConfirm extends JilNode, Transform, Factory {
}
/**
 * @ignore
 */
export interface JilConfirmParams extends ITransformParam {
    title?: string;
    content?: string;
}
export declare class JilConfirm {
    this: any;
    title: string;
    content: string;
    private okButton;
    private cancelButton;
    private clickEvent;
    private cancelEvent;
    constructor(id: string, params: ITransformParam, parent: JilNode, projector: Projector | undefined);
    show(): void;
    hide(): void;
    onClick(cb: () => void): void;
    onCancel(cb: () => void): void;
    private createButton;
    render(): VNode;
}
