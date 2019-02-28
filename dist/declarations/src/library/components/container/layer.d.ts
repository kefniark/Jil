import { VNode, Projector } from 'maquette';
import { JilNode, Transform, TransformTween, Factory } from '../../behaviours';
import { JilPanel } from './panel';
import { JilCanvas } from './canvas';
import { JilButton } from '../element/button';
import { JilImage } from '../element/image';
import { JilText } from '../element/text';
export interface JilLayer extends JilNode, Transform, Factory, TransformTween {
}
export declare class JilLayer {
    this: any;
    classname: string;
    constructor(id: string, params: any, parent: JilNode, projector: Projector | undefined);
    createPanel: (id: string) => JilPanel;
    createButton: (id: string, params?: any) => JilButton;
    createImage: (id: string, params?: any) => JilImage;
    createText: (id: string, params?: any) => JilText;
    createCanvas: (id: string, params?: any) => JilCanvas;
    private resizeHandler;
    render(): VNode;
}
