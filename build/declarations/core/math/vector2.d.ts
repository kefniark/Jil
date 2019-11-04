import { ITween } from "fatina";
import { Component } from "../../core/gameobject";
export declare class Vector2 {
    private getter;
    private parent;
    x: number;
    y: number;
    constructor(parent: Component, getter: () => number[]);
    set(x?: number, y?: number): void;
    setPx(x?: number, y?: number): void;
    add(x?: number, y?: number): void;
    addPx(x?: number, y?: number): void;
    scale(x?: number, y?: number): void;
    tween(): ITween;
}
