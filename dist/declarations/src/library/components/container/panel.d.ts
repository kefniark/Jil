import { VNode, Projector } from 'maquette';
import { JilNode, Transform, TransformTween, Factory, Layout } from '../../behaviours';
import { JilCanvas } from './canvas';
import { JilButton } from '../element/button';
import { JilImage } from '../element/image';
import { JilText } from '../element/text';
export interface JilPanel extends JilNode, Transform, Factory, TransformTween, Layout {
}
export declare class JilPanel {
    this: any;
    constructor(id: string, params: any, parent: JilNode, projector: Projector | undefined);
    render(): VNode;
    createPanel: (id: string) => JilPanel;
    createButton: (id: string, params?: any) => JilButton;
    createImage: (id: string, params?: any) => JilImage;
    createText: (id: string, params?: any) => JilText;
    createCanvas: (id: string, params?: any) => JilCanvas;
    refreshLayout(): void;
}
