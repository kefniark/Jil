import { Vector2 } from '../../helpers';
export declare class Transform {
    enable: boolean;
    anchor: Vector2;
    pivot: Vector2;
    position: Vector2;
    positionPx: Vector2;
    size: Vector2;
    sizePx: Vector2;
    scale: Vector2;
    opacity: number;
    rotation: number;
    /**
     * @ignore
     */
    resetStyle(): void;
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
