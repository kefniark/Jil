import { EntityStore, IComponentData } from "kaaya";
import { Component } from "../../core/gameobject";
export interface IImageData extends IComponentData {
    opacity: number;
    src: string;
}
export declare class ImageComponent extends Component {
    constructor(store: EntityStore, data: IImageData);
    updateStyle(): void;
    render(): import("redom").RedomElement;
}
