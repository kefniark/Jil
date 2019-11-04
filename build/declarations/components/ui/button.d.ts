import { EntityStore, IComponentData } from "kaaya";
import { Component } from "../../core/gameobject";
export interface IButtonData extends IComponentData {
    text: string;
    disabled: boolean;
}
export declare class ButtonComponent extends Component {
    constructor(store: EntityStore, data: IButtonData);
    getClass(): void;
    render(): import("redom").RedomElement;
}
