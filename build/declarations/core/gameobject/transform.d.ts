import { EntityStore, IComponentData } from "kaaya";
import { Component } from "./component";
import { Vector2, Vector3 } from "../../core/math";
export interface ITransformData extends IComponentData {
    position: number[];
    rotation: number[];
    scale: number[];
    anchor: number[];
    pivot: number[];
    size: number[];
}
export declare class TransformComponent extends Component {
    private _position;
    readonly position: Vector2;
    private _rotation;
    readonly rotation: Vector3;
    private _scale;
    readonly scale: Vector2;
    private _anchor;
    readonly anchor: Vector2;
    private _size;
    readonly size: Vector2;
    private _pivot;
    readonly pivot: Vector2;
    constructor(store: EntityStore, data: ITransformData);
    created(): void;
    toCss(): Partial<CSSStyleDeclaration>;
}
