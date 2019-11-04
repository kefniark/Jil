import { EntityStore, IComponentData } from "kaaya";
import { GameObject } from "./gameobject";
import { RedomElement } from "redom";
export declare class Component {
    protected _element: RedomElement;
    readonly id: string;
    readonly name: string;
    readonly gameobject: GameObject;
    readonly transform: import("./transform").TransformComponent;
    protected readonly watchedData: any;
    protected store: EntityStore;
    protected data: IComponentData;
    dataDefault: IComponentData;
    constructor(store: EntityStore, data: IComponentData);
    created(): void;
    deleted(): void;
    tween(): import("fatina").ITween;
    mounted(): void;
    unmounted(): void;
    enabled(): void;
    disabled(): void;
    updateStyle(): void;
    render(): RedomElement | undefined;
}
