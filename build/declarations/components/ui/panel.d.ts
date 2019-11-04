import { EntityStore, IComponentData } from "kaaya";
import { Component } from "../../core/gameobject";
export interface IPanelData extends IComponentData {
}
export declare class PanelComponent extends Component {
    constructor(store: EntityStore, data: any);
    render(): import("redom").RedomElement;
}
