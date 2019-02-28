import { Vector2, Vector2Extend } from '../../helpers';
import { JilNode } from './node';
export declare class Transform {
    enable: boolean;
    readonly node: JilNode;
    anchor: Vector2Extend;
    pivot: Vector2Extend;
    position: Vector2Extend;
    size: Vector2Extend;
    positionPx: Vector2;
    sizePx: Vector2;
    scale: Vector2;
    opacity: number;
    rotation: number;
    /**
     * @ignore
     */
    resetTransform(): void;
    /**
     * @ignore
     */
    getStyle(): {
        display: string;
        width: string;
        height: string;
        transformOrigin: string;
        opacity: string;
        transform: string;
        willChange: string;
    };
}
