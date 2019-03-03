import { VNode, Projector } from 'maquette';
import { JilNode, Transform, TransformTween, Factory, Layout, ITransformParam } from '../../behaviours';
import { JilCanvas } from './canvas';
import { JilButton, JilButtonParams } from '../element/button';
import { JilImage, JilImageParams } from '../element/image';
import { JilText, JilTextParams } from '../element/text';
import { JilRadio, JilRadioParams } from '../element/radio';
import { JilCheckbox, JilCheckboxParams } from '../element/checkbox';
import { JilSelect, JilSelectParams } from '../element/select';
import { JilInput, JilInputParams } from '../element/input';
export interface JilPanel extends JilNode, Transform, Factory, TransformTween, Layout {
}
export declare class JilPanel {
    this: any;
    constructor(id: string, params: ITransformParam, parent: JilNode, projector: Projector | undefined);
    createCanvas: (id: string, params?: ITransformParam | undefined) => JilCanvas;
    createPanel: (id: string, params?: ITransformParam | undefined) => JilPanel;
    createButton: (id: string, params?: string | JilButtonParams | undefined) => JilButton;
    createCheckbox: (id: string, params?: JilCheckboxParams | undefined) => JilCheckbox;
    createImage: (id: string, params?: string | JilImageParams | undefined) => JilImage;
    createInput: (id: string, params?: string | JilInputParams | undefined) => JilInput;
    createRadio: (id: string, params?: JilRadioParams | undefined) => JilRadio;
    createSelect: (id: string, params?: JilSelectParams | undefined) => JilSelect;
    createText: (id: string, params?: string | JilTextParams | undefined) => JilText;
    refreshLayout(): void;
    render(): VNode;
}
