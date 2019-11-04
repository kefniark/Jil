import { EntityStore, IComponentData } from "kaaya";
import { Component } from "../../core/gameobject";
export interface IGridLayoutData extends IComponentData {
    row: number;
    col: number;
    cellWidth: number;
    cellHeight: number;
}
export declare class GridLayoutComponent extends Component {
    row: number;
    col: number;
    protected data: IGridLayoutData;
    constructor(store: EntityStore, data: IGridLayoutData);
    created(): void;
    render(): import("redom").RedomElement;
}
