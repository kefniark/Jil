import { EntityStore, IComponentData } from "kaaya";
import { Component } from "../../core/gameobject";
export interface ISceneData extends IComponentData {
}
export declare class SceneComponent extends Component {
    constructor(store: EntityStore, data: any);
    created(): void;
    refreshStyle(): void;
    render(): import("redom").RedomElement;
}
