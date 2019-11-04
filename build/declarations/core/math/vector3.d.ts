import { ITween } from "fatina";
import { Component } from "../../core/gameobject";
export declare class Vector3 {
    private getter;
    private parent;
    x: number;
    y: number;
    z: number;
    constructor(parent: Component, getter: () => number[]);
    set(x?: number, y?: number, z?: number): void;
    add(x?: number, y?: number, z?: number): void;
    scale(x?: number, y?: number, z?: number): void;
    tween(): ITween;
}
